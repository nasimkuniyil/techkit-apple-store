app.post('/checkout/apply-coupon', async (req, res) => {
    const { couponCode, cartTotal } = req.body;
    
    // Find the coupon
    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code.' });
    }
    
    // Check if the coupon is expired
    if (new Date(coupon.expirationDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired.' });
    }
    
    // Check if the cart total meets the minimum purchase
    if (cartTotal < coupon.minimumPurchase) {
      return res.status(400).json({ message: `Minimum purchase of $${coupon.minimumPurchase} required.` });
    }
  
    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached.' });
    }
  
    // Calculate the discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (coupon.discountValue / 100) * cartTotal;
    } else if (coupon.discountType === 'fixed') {
      discount = coupon.discountValue;
    }
    
    // Update used count
    coupon.usedCount += 1;
    await coupon.save();
    
    res.status(200).json({ discount });
  });
  

//   finalize
app.post('/checkout/finalize', (req, res) => {
    const { cartTotal, discount } = req.body;
    const finalPrice = cartTotal - discount;
    res.status(200).json({ finalPrice });
  });

  
//   7. Test the Coupon System
// Finally, thoroughly test the coupon system. Ensure that:

// Coupons are applied correctly.
// Expired coupons are rejected.
// Coupons that exceed usage limits are rejected.
// Discounts are calculated correctly.