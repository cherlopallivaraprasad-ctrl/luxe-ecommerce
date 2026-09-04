const prisma = require('../config/prisma');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      search = '',
      category = '',
      brand = '',
      minPrice,
      maxPrice,
      minRating,
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (featured === 'true') where.featured = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minRating) {
      where.rating = { gte: parseFloat(minRating) };
    }

    let orderBy = {};
    switch (sort) {
      case 'price_asc':   orderBy = { price: 'asc' }; break;
      case 'price_desc':  orderBy = { price: 'desc' }; break;
      case 'rating':      orderBy = { rating: 'desc' }; break;
      case 'popular':     orderBy = { reviewCount: 'desc' }; break;
      default:            orderBy = { createdAt: 'desc' }; // newest
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limitNum }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const parseProduct = (p) => {
  if (!p) return p;
  let specifications = p.specifications;
  if (typeof specifications === 'string') {
    try {
      specifications = JSON.parse(specifications);
    } catch {
      // keep
    }
  }
  return { ...p, specifications };
};

// GET /api/products/:id
const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Get related products (same category)
    const related = await prisma.product.findMany({
      where: { category: product.category, id: { not: product.id }, isActive: true },
      take: 4,
      orderBy: { rating: 'desc' },
    });

    res.json({ success: true, data: { product: parseProduct(product), related: related.map(parseProduct) } });
  } catch (error) {
    next(error);
  }
};

// POST /api/products (Admin)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, brand, sku, image, stock, rating, reviewCount, featured, specifications } = req.body;

    if (!name || !description || !price || !category || !brand || !sku || !image) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        category,
        brand,
        sku,
        image,
        stock: parseInt(stock) || 0,
        rating: parseFloat(rating) || 0,
        reviewCount: parseInt(reviewCount) || 0,
        featured: Boolean(featured),
        specifications: specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null,
      },
    });

    res.status(201).json({ success: true, message: 'Product created successfully!', data: { product: parseProduct(product) } });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPrice, category, brand, sku, image, stock, rating, reviewCount, featured, isActive, specifications } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? parseFloat(discountPrice) : null }),
        ...(category !== undefined && { category }),
        ...(brand !== undefined && { brand }),
        ...(sku !== undefined && { sku }),
        ...(image !== undefined && { image }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(rating !== undefined && { rating: parseFloat(rating) }),
        ...(reviewCount !== undefined && { reviewCount: parseInt(reviewCount) }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(specifications !== undefined && {
          specifications: specifications ? (typeof specifications === 'string' ? specifications : JSON.stringify(specifications)) : null,
        }),
      },
    });

    res.json({ success: true, message: 'Product updated successfully!', data: { product: parseProduct(product) } });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
    });
    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCategories };
