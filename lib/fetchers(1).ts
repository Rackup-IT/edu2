import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';
import Settings from '@/models/Settings';
import Service from '@/models/Service';
import Product from '@/models/Product';
import Portfolio from '@/models/Portfolio';
import Post from '@/models/Post';
import Testimonial from '@/models/Testimonial';
import About from '@/models/About';
import Theme from '@/models/Theme';

// Wrapper for dbConnect to handle errors gracefully during build
async function safeDbConnect() {
  try {
    await dbConnect();
    return true;
  } catch (error) {
    console.warn("Database connection failed during build, using empty data.");
    return false;
  }
}

export const getHeroData = async () => {
  if (!(await safeDbConnect())) return null;
  try {
    const hero = await Hero.findOne().lean();
    if (!hero) return null;
    return JSON.parse(JSON.stringify(hero));
  } catch { return null; }
};

export const getSettingsData = async () => {
  if (!(await safeDbConnect())) return {};
  try {
    const settings = await Settings.findOne().lean();
    return JSON.parse(JSON.stringify(settings || {}));
  } catch { return {}; }
};

export const getServicesData = async () => {
  if (!(await safeDbConnect())) return [];
  try {
    const services = await Service.find({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(services));
  } catch { return []; }
};

export const getProductsData = async () => {
  if (!(await safeDbConnect())) return [];
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch { return []; }
};

export const getPortfoliosData = async () => {
  if (!(await safeDbConnect())) return [];
  try {
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(portfolios));
  } catch { return []; }
};

export const getPortfolioById = async (id: string) => {
  if (!(await safeDbConnect())) return null;
  try {
    const portfolio = await Portfolio.findById(id).lean();
    if (!portfolio) return null;
    return JSON.parse(JSON.stringify(portfolio));
  } catch { return null; }
};

export const getPostsData = async () => {
  if (!(await safeDbConnect())) return [];
  try {
    const posts = await Post.find({}).sort({ date: -1 }).lean();
    return JSON.parse(JSON.stringify(posts));
  } catch { return []; }
};

export const getPostBySlug = async (slug: string) => {
  if (!(await safeDbConnect())) return null;
  try {
    const post = await Post.findOne({ slug }).lean();
    if (!post) return null;
    return JSON.parse(JSON.stringify(post));
  } catch { return null; }
};

export const getTestimonialsData = async () => {
  if (!(await safeDbConnect())) return [];
  try {
    const testimonials = await Testimonial.find({}).lean();
    return JSON.parse(JSON.stringify(testimonials));
  } catch { return []; }
};

export const getAboutData = async () => {
  if (!(await safeDbConnect())) return null;
  try {
    const about = await About.findOne().lean();
    if (!about) return null;
    return JSON.parse(JSON.stringify(about));
  } catch { return null; }
};

export const getThemeData = async () => {
  if (!(await safeDbConnect())) return null;
  try {
    const theme = await Theme.findOne().lean();
    if (!theme) return null;
    return JSON.parse(JSON.stringify(theme));
  } catch { return null; }
};
