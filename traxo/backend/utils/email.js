const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOrderConfirmationEmail(order) {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2>Thank you for your order, ${order.sender.name}!</h2>
        <p>Your order has been received and is being processed. Here are your order details:</p>
        <table style="border-collapse: collapse;">
          <tr><td><strong>Order ID:</strong></td><td>${order.orderId}</td></tr>
          <tr><td><strong>Estimated Pickup:</strong></td><td>${order.estimatedPickup}</td></tr>
          <tr><td><strong>Estimated Delivery:</strong></td><td>${order.estimatedDeliveryStart} - ${order.estimatedDeliveryEnd}</td></tr>
          <tr><td><strong>Chargeable Weight:</strong></td><td>${order.shippingCost.chargeableWeight} kg</td></tr>
          <tr><td><strong>Volumetric Weight:</strong></td><td>${order.shippingCost.volumetricWeight} kg</td></tr>
          <tr><td><strong>Base Shipping:</strong></td><td>₹${order.shippingCost.baseShippingCost}</td></tr>
          <tr><td><strong>Fuel Surcharge:</strong></td><td>₹${order.shippingCost.fuelSurcharge}</td></tr>
          <tr><td><strong>Handling:</strong></td><td>₹${order.shippingCost.handlingCharge}</td></tr>
          <tr><td><strong>Total Amount:</strong></td><td><strong>₹${order.grandTotal}</strong></td></tr>
        </table>
        <p>If you have any questions, reply to this email or contact our support team.</p>
        <p>Best regards,<br/>Your Company Team</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: 'Your Company <no-reply@yourdomain.com>',
      to: order.sender.email,
      subject: `Order Confirmation - ${order.orderId}`,
      html,
    });

    console.log('Order confirmation email sent:', data);
    return data;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
}

module.exports = { sendOrderConfirmationEmail }; 