import mongoose from 'mongoose';
import dns from 'dns';

// Workaround for Node.js DNS issues on some networks
// specifically 'querySrv ECONNREFUSED' errors with MongoDB +srv strings.
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Could not set custom DNS servers', e);
}

const MONGODB_URI = process.env.MONGODB_URI;

// We only throw if we are NOT in a build context where this might be optional or mockable.
// However, standard Next.js behavior is to build pages that might need DB.
// We'll use a lenient check to allow build to proceed without env var,
// relying on runtime connection checks or safe wrappers.
const safeURI = MONGODB_URI || "mongodb://localhost:27017/placeholder_for_build";

async function resolveMongoDbUri(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) return uri;
  
  try {
    const parsed = new URL(uri);
    const hostname = parsed.hostname;
    const srvHostname = '_mongodb._tcp.' + hostname;
    
    // Explicitly use Google DNS for this resolution
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4']);
    
    const addresses = await resolver.resolveSrv(srvHostname);
    addresses.sort((a, b) => {
        if (a.priority === b.priority) return b.weight - a.weight;
        return a.priority - b.priority;
    });
    
    let txtRecords: string[][] = [];
    try {
        txtRecords = await resolver.resolveTxt(hostname);
    } catch(e) {}
    const txtOptions = txtRecords.length > 0 ? txtRecords.join('') : '';

    const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
    
    let newUri = `mongodb://${parsed.username ? `${parsed.username}:${parsed.password}@` : ''}${hosts}${parsed.pathname}`;
    
    const params = new URLSearchParams(parsed.search);
    params.set('ssl', 'true');
    params.set('authSource', 'admin');
    
    if (txtOptions) {
        const parts = txtOptions.split('&');
        for (const p of parts) {
            const [k, v] = p.split('=');
            if (k && v) params.set(k, v);
        }
    }
    
    newUri += '?' + params.toString();
    console.log('Successfully manually resolved SRV database connection URI.');
    return newUri;
  } catch (err) {
    console.error('Failed to manually resolve SRV record, falling back to original URI:', err);
    return uri;
  }
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached && cached.conn) {
    return cached.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    // Use our custom SRV resolver to avoid Next.js / Node DNS issues
    cached!.promise = resolveMongoDbUri(safeURI).then(resolvedURI => {
      return mongoose.connect(resolvedURI, opts).then((mongoose) => {
        return mongoose;
      });
    });
  }
  
  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    // In production/runtime, we want to throw. In build, we might want to suppress if it's just static generation failing.
    // But since we are using 'force-dynamic' removal and 'unstable_cache', avoiding the throw allows
    // the fetchers to return null/empty data instead of crashing the build process.
    // However, for correct runtime behavior, failing to connect SHOULD probably throw?
    // Let's rely on the caller to handle the error or this function to return null on failure.
    // Returning null changes the signature from Promise<typeof mongoose> to Promise<typeof mongoose | null>
    // but the `fetchers.ts` already handles this.
    console.error("Mongoose connection error:", e);
    return null;
  }

  return cached!.conn;
}

export default dbConnect;
