import Cart from "../model/Cart.model.js";

export const addToCart = async (req, res) => {
    const { userId, productId, name, price, quantity } = req.body;
    
    // Validate required fields
    if (!userId || !productId || !name || !price || !quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Find the user's cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // If cart doesn't exist, create a new one
            const newProduct = {
                productId,
                name,
                price,
                quantity
            };

            cart = await Cart.create({
                userId,
                products: [newProduct],
                price: price * quantity, // Individual product total
                totalQuantity: quantity,
                totalPrice: price * quantity
            });

            return res.status(201).json({
                success: true,
                message: "Product added to new cart successfully",
                data: cart
            });
        }

        // If cart exists, check if product already in cart
        const existingProductIndex = cart.products.findIndex(
            p => p.productId === productId
        );

        if (existingProductIndex > -1) {
            // Update existing product quantity
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.products.push({
                productId,
                name,
                price,
                quantity
            });
        }

        // Recalculate cart totals
        let newTotalQuantity = 0;
        let newTotalPrice = 0;

        cart.products.forEach(product => {
            newTotalQuantity += product.quantity;
            newTotalPrice += product.price * product.quantity;
        });

        cart.totalQuantity = newTotalQuantity;
        cart.totalPrice = newTotalPrice;
        cart.price = newTotalPrice; // Or keep separate logic for subtotal

        // Save updated cart
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding product to cart",
            error: error.message
        });
    }
};

export const getCart = async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    try{
        const cart = await Cart.findOne({ userId });
        res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.body;
    
    if (!userId || !productId) {
        return res.status(400).json({ message: "User ID and product ID are required" });
    }

    try {
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter(p => p.productId !== productId);
        
        if (cart.products.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
            return res.status(200).json({
                success: true,
                message: "Cart deleted as it's now empty",
                data: null
            });
        }

        // Recalculate totals
        cart.totalQuantity = cart.products.reduce((sum, p) => sum + p.quantity, 0);
        cart.totalPrice = cart.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing product",
            error: error.message
        });
    }
};


export const updateCartItem = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    
    if (!userId || !productId || quantity === undefined) {
        return res.status(400).json({ message: "User ID, product ID, and quantity are required" });
    }

    try {
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(p => p.productId === productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (quantity <= 0) {
            // Remove product if quantity is 0 or negative
            cart.products.splice(productIndex, 1);
        } else {
            // Update to exact quantity (whether increasing or decreasing)
            cart.products[productIndex].quantity = quantity;
        }

        // Recalculate totals
        cart.totalQuantity = cart.products.reduce((sum, p) => sum + p.quantity, 0);
        cart.totalPrice = cart.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

        // If cart becomes empty, you might want to delete it or keep empty cart
        if (cart.products.length === 0) {
            await Cart.deleteOne({ _id: cart._id });
            return res.status(200).json({
                success: true,
                message: "Cart is now empty",
                data: null
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
    }
};