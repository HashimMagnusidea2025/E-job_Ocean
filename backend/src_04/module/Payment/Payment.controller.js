import PaymentModel from "./Payment.model.js";
import nodemailer from 'nodemailer';

import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';

import dotenv from 'dotenv';
dotenv.config();
// import Razorpay from "razorpay";
// import dotenv from "dotenv";
import webinarRegistrationModel from "../webinarRegistration/webinarRegistration.model.js";



// dotenv.config();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY,
//   key_secret: process.env.RAZORPAY_SECRET,
// });




// export const CreatePayment = async (req, res) => {

//     try {

//         const {
//             r_payment_id,
//             method,
//             currency,
//             gst,
//             total_amount,
//             json_response,
//             registration_id,
//         } = req.body;


//         const registration = await webinarRegistrationModel.findById(registration_id);

//         if (!registration) return res.status(404).json({ message: "Registration not found" });


//         const Payment = new PaymentModel({

//             r_payment_id,
//             method,
//             currency,
//             gst,
//             total_amount,
//             json_response,
//             registration_id,
//         });
//         await Payment.save();

//         res.status(201).json({ message: "Payment recorded successfully", Payment });

//     } catch (err) {
//         console.error("Payment creation error:", err);
//         res.status(500).json({ message: err.message });
//     };



// }


// export const getPayment = async (req, res) => {


//     try {

//         const payments = await PaymentModel.find().populate("registration_id", "firstName lastName email webinarId");
//         res.status(200).json(payments);

//     } catch (err) {
//         console.error("Error fetching payments:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


export const getPaymentByRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const payment = await PaymentModel.findOne({ registration_id: registrationId })
      .populate("registration_id", "firstName lastName email webinarId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (err) {
    console.error("Error fetching payment by registration:", err);
    res.status(500).json({ error: "Server error" });
  }
};




import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, registrationId } = req.body;

    // Shorten receipt to max 40 chars
    // const shortReceiptId = `rec_${registrationId.slice(-10)}_${Date.now().toString().slice(-6)}`;
    if (!registrationId) {
      return res.status(400).json({ error: "registrationId is required" });
    }

    const shortReceiptId = `rec_${registrationId.slice(-10)}_${Date.now().toString().slice(-6)}`;

    const razorpayAmount = Math.round(amount);
    const options = {
      amount: razorpayAmount, // in paise
      currency: currency || "INR",
      receipt: shortReceiptId,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
};


// Verify payment & save
// export const verifyRazorpayPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       registrationId,
//       courseId,
//       amount,
//       gst,
//       user_email,
//       type,
//     } = req.body;
//     //  Add guard here

//     // ✅ FIX: Only require registrationId OR courseId based on type
//     if (!registrationId && !courseId) {
//       return res.status(400).json({
//         error: "Either registrationId or courseId is required"
//       });
//     }

//     if (!user_email) {
//       return res.status(400).json({
//         error: "user_email is required"
//       });
//     }

//     // GST ko number me parse kar lo
//     const gstValue = gst ? parseFloat(gst) : 0;
//     // Total fees without GST
//     const baseAmount = amount - gstValue;
//     const payment = await PaymentModel.create({
//       registration_id: registrationId,
//       course_id: courseId,
//       user_email,
//       r_payment_id: razorpay_payment_id,
//       method: "razorpay",
//       total_Amount: baseAmount,
//       gst: gstValue,
//       currency: "INR",
//       user_email: user_email,
//       type,

//       json_response: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
//     });

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });


//     // ✅ Email HTML (Receipt)

//     const mailOptions = {
//       from: `"E JOB OCEAN ONLINE SERVICES LLP" <${process.env.SMTP_EMAIL}>`,
//       to: user_email,
//       subject: `Payment Successful - E JOB OCEAN ONLINE SERVICES LLP`,
//       html: `
//       <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:10px;">
//         <h2 style="text-align:center; margin-bottom:5px;">E JOB OCEAN ONLINE SERVICES LLP</h2>
//         <p style="text-align:center; font-size:13px;">3132, Eaze Zone Mall, Sunder Nagar, Malad West, Mumbai 400064</p>
//         <p style="text-align:center; font-size:13px;">GSTIN: 27AAFFE6172J1ZT</p>

//         <hr style="margin:15px 0;" />
//         <table style="width:100%; font-size:14px;">
//           <tr><td><b>Date:</b></td><td>${new Date().toLocaleDateString("en-GB")}</td></tr>
//           <tr><td><b>Billing To:</b></td><td>${user_email}</td></tr>
//         </table>

//         <h3 style="margin-top:20px;">Payment Details</h3>
//         <table style="width:100%; border-collapse:collapse; font-size:14px;">
//           <tr style="background:#f2f2f2;">
//             <th style="text-align:left; padding:8px;">Description</th>
//             <th style="text-align:right; padding:8px;">Amount</th>
//           </tr>
//           <tr>
//             <td style="padding:8px;">Session Registration</td>
//             <td style="text-align:right; padding:8px;">₹ ${baseAmount.toFixed(2)}</td>
//           </tr>
//           <tr>
//             <td style="padding:8px;">GST</td>
//             <td style="text-align:right; padding:8px;">₹ ${gstValue.toFixed(2)}</td>
//           </tr>
//           <tr style="background:#f9f9f9; font-weight:bold;">
//             <td style="padding:8px;">Total Paid</td>
//             <td style="text-align:right; padding:8px;">₹ ${(baseAmount + gstValue).toFixed(2)}</td>
//           </tr>
//         </table>

//         <p style="margin-top:20px; font-size:13px; color:#333;">
//           Thank you for your payment. This email serves as your official receipt.
//         </p>
//         <p style="font-size:12px; color:#666;">If you have any questions, please contact support@ejobocean.com.</p>
//       </div>
//     `,
//     };

//     // ✅ Send email safely
//     try {
//       await transporter.sendMail(mailOptions);
//       console.log("✅ Payment receipt sent to", user_email);
//     } catch (mailErr) {
//       console.error("❌ Email sending error:", mailErr.message);
//     }

//     res.json({ success: true, payment });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Payment verification failed" });
//   }
// };

// Verify payment & save with proper GST calculation
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registrationId,
      courseId,
      amount,
      gst,
      gst_type,
      cgst,
      sgst,
      igst,
      user_email,
      type,
    } = req.body;

    // ✅ FIX: Only require registrationId OR courseId based on type
    if (!registrationId && !courseId) {
      return res.status(400).json({
        error: "Either registrationId or courseId is required"
      });
    }

    if (!user_email) {
      return res.status(400).json({
        error: "user_email is required"
      });
    }

    // Get registration data to determine state for GST calculation
    let registration = null;
    if (registrationId) {
      registration = await webinarRegistrationModel.findById(registrationId);
    }

    // Parse amounts
    const totalAmount = amount ? parseFloat(amount) : 0;
    const gstValue = gst ? parseFloat(gst) : 0;

    // Calculate base amount (without GST)
    const baseAmount = totalAmount - gstValue;

    // If GST details not provided, calculate based on registration state
    let finalGstDetails = {
      type: gst_type || 'IGST',
      cgst: cgst ? parseFloat(cgst) : 0,
      sgst: sgst ? parseFloat(sgst) : 0,
      igst: igst ? parseFloat(igst) : 0,
      totalGST: gstValue
    };

    // If GST details not provided from frontend, calculate based on state
    if (!gst_type && registration) {
      finalGstDetails = calculateGST(baseAmount, registration.state);
    }

    console.log("💰 GST Calculation Details:");
    console.log("Base Amount:", baseAmount);
    console.log("State:", registration?.state);
    console.log("GST Type:", finalGstDetails.type);
    console.log("CGST:", finalGstDetails.cgst);
    console.log("SGST:", finalGstDetails.sgst);
    console.log("IGST:", finalGstDetails.igst);
    console.log("Total GST:", finalGstDetails.totalGST);

    // Create payment record
    const payment = await PaymentModel.create({
      registration_id: registrationId,
      course_id: courseId,
      user_email,
      r_payment_id: razorpay_payment_id,
      method: "razorpay",
      total_Amount: baseAmount,
      gst: finalGstDetails.totalGST,
      cgst: finalGstDetails.cgst,
      sgst: finalGstDetails.sgst,
      igst: finalGstDetails.igst,
      gst_type: finalGstDetails.type,
      currency: "INR",
      type,
      json_response: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      },
    });


    // Generate PDF Invoice
    const pdfBuffer = await generatePDFInvoice({
      companyName: "E JOB OCEAN ONLINE SERVICES LLP",
      companyAddress: "3132, Eaze Zone Mall, Sunder Nagar, Malad West, Mumbai 400064",
      gstin: "27AAFFE6172J1ZT",
      cin: "U74999MH2023OPC403123",
      invoiceNumber: `INV-${razorpay_payment_id.slice(-8)}`,
      date: new Date().toLocaleDateString("en-GB"),
      transactionId: razorpay_payment_id,
      customerEmail: user_email,
      baseAmount: baseAmount,
      gstDetails: finalGstDetails,
      totalAmount: totalAmount,
      webinarTitle: registration?.webinarId?.WebinarTitle || "Webinar Session"
    });

    // Send email receipt
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // ✅ Updated Email HTML with proper GST breakdown
    const mailOptions = {
      from: `"E JOB OCEAN ONLINE SERVICES LLP" <${process.env.SMTP_EMAIL}>`,
      to: user_email,
      subject: `Payment Successful - E JOB OCEAN ONLINE SERVICES LLP`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; padding:20px; border-radius:10px;">
        <h2 style="text-align:center; margin-bottom:5px; color:#2563eb;">E JOB OCEAN ONLINE SERVICES LLP</h2>
        <p style="text-align:center; font-size:13px; color:#666;">3132, Eaze Zone Mall, Sunder Nagar, Malad West, Mumbai 400064</p>
        <p style="text-align:center; font-size:13px; color:#666;">GSTIN: 27AAFFE6172J1ZT</p>

        <hr style="margin:15px 0; border:1px solid #eee;" />
        
        <table style="width:100%; font-size:14px; margin-bottom:20px;">
          <tr>
            <td><b>Date:</b></td>
            <td>${new Date().toLocaleDateString("en-GB")}</td>
          </tr>
          <tr>
            <td><b>Transaction ID:</b></td>
            <td>${razorpay_payment_id}</td>
          </tr>
          <tr>
            <td><b>Billing To:</b></td>
            <td>${user_email}</td>
          </tr>
         ${registration?.gstNumber
  ? `<tr>
       <td><b>GST Number:</b></td>
       <td>${registration.gstNumber}</td>
     </tr>`
  : ""}

        </table>

        <h3 style="margin-top:20px; color:#333; border-bottom:2px solid #2563eb; padding-bottom:8px;">Payment Details</h3>
        <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:20px;">
          <tr style="background:#f8fafc;">
            <th style="text-align:left; padding:12px; border:1px solid #e2e8f0;">Description</th>
            <th style="text-align:right; padding:12px; border:1px solid #e2e8f0;">Amount (₹)</th>
          </tr>
          <tr>
            <td style="padding:12px; border:1px solid #e2e8f0;">Session Registration Fee</td>
            <td style="text-align:right; padding:12px; border:1px solid #e2e8f0;">₹ ${baseAmount.toFixed(2)}</td>
          </tr>
          
          ${finalGstDetails.type === 'CGST+SGST' ? `
            <tr>
              <td style="padding:12px; border:1px solid #e2e8f0;">CGST (9%)</td>
              <td style="text-align:right; padding:12px; border:1px solid #e2e8f0;">₹ ${finalGstDetails.cgst.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:12px; border:1px solid #e2e8f0;">SGST (9%)</td>
              <td style="text-align:right; padding:12px; border:1px solid #e2e8f0;">₹ ${finalGstDetails.sgst.toFixed(2)}</td>
            </tr>
          ` : `
            <tr>
              <td style="padding:12px; border:1px solid #e2e8f0;">IGST (18%)</td>
              <td style="text-align:right; padding:12px; border:1px solid #e2e8f0;">₹ ${finalGstDetails.igst.toFixed(2)}</td>
            </tr>
          `}
          
          <tr style="background:#f0f9ff; font-weight:bold;">
            <td style="padding:12px; border:1px solid #2563eb; color:#2563eb;">Total Amount Paid</td>
            <td style="text-align:right; padding:12px; border:1px solid #2563eb; color:#2563eb;">₹ ${(baseAmount + finalGstDetails.totalGST).toFixed(2)}</td>
          </tr>


        
        </table>

        

        <p style="margin-top:20px; font-size:13px; color:#333; text-align:center;">
          Thank you for your payment. This email serves as your official receipt.
        </p>
        <p style="font-size:12px; color:#666; text-align:center;">
          If you have any questions, please contact support@ejobocean.com.
        </p>

        <p style=" text-align:center;">
           Stay Connected with us through 
          <a href="https://www.whatsapp.com/channel/0029Va9eG38545unsNxNkA3z" 
            target="_blank" 
            style="color:#25D366; text-decoration:none; font-weight:bold;">
             WhatsApp
           </a> 
            and also  <a href="https://site.ejobocean.in/ca-register" 
            target="_blank" 
            style="color:#25D366; text-decoration:none; font-weight:bold;">
             Register Hare
           </a> 
        </p>

        <table>
        <tr>
              <td bgcolor="#F8F9FA" style="padding:20px;  font-size:14px; color:#555555; text-align:center; border-top:1px solid #dddddd;">
                <p style="font-size:16px; color:#888; margin:0 0 15px;">Stay connected with us through our social media platforms.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                  <tr>
                    <td align="center" style="padding:5px;">
                      <a href="https://www.instagram.com/" target="_blank" style="background:#E4405F; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">Instagram</a>
                    </td>
                    <td align="center" style="padding:5px;">
                      <a href="https://www.facebook.com/" target="_blank" style="background:#1877F2; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">Facebook</a>
                    </td>
                    <td align="center" style="padding:5px;">
                      <a href="https://www.linkedin.com/" target="_blank" style="background:#0077B5; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">LinkedIn</a>
                    </td>
                    <td align="center" style="padding:5px;">
                      <a href="https://twitter.com/" target="_blank" style="background:#1DA1F2; padding:8px 12px; border-radius:6px; color:#fff; text-decoration:none;">Twitter</a>
                    </td>
                  </tr>
                </table>
                
              </td>
            </tr>
            </table>
        
        <div style="margin-top:20px; padding:15px; background:#f7f7f7; border-radius:8px; text-align:center;">
          <p style="margin:0; font-size:12px; color:#666;">
            <b>E JOB OCEAN ONLINE SERVICES LLP</b><br/>
            CIN: U74999MH2023OPC403123 | GSTIN: 27AAFFE6172J1ZT
          </p>
        </div>
      </div>
      `,

      attachments: [
        {
          filename: `Invoice-${razorpay_payment_id.slice(-8)}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // ✅ Send email safely
    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Payment receipt sent to", user_email);
    } catch (mailErr) {
      console.error("❌ Email sending error:", mailErr.message);
    }

    res.json({
      success: true,
      payment,
      gst_details: finalGstDetails
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// PDF Invoice Generation Function
const generatePDFInvoice = async (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).font('Helvetica-Bold')
        .fillColor('#2563eb')
        .text('E JOB OCEAN ONLINE SERVICES LLP', 50, 50, { align: 'center' });

      doc.fontSize(10).font('Helvetica')
        .fillColor('#666666')
        .text('3132, Eaze Zone Mall, Sunder Nagar, Malad West, Mumbai 400064', 50, 75, { align: 'center' });

      doc.text(`GSTIN: ${invoiceData.gstin} | CIN: ${invoiceData.cin}`, 50, 90, { align: 'center' });

      // Invoice Title
      doc.fontSize(16).font('Helvetica-Bold')
        .fillColor('#000000')
        .text('TAX INVOICE', 50, 120, { align: 'center' });

      // Invoice Details
      doc.fontSize(10).font('Helvetica')
        .fillColor('#000000')
        .text(`Invoice Number: ${invoiceData.invoiceNumber}`, 50, 160)
        .text(`Date: ${invoiceData.date}`, 300, 160)
        .text(`Transaction ID: ${invoiceData.transactionId}`, 50, 175)
        .text(`Customer Email: ${invoiceData.customerEmail}`, 300, 175);

      // Line separator
      doc.moveTo(50, 200).lineTo(550, 200).strokeColor('#cccccc').stroke();

      // Service Details
      doc.fontSize(12).font('Helvetica-Bold')
        .text('Service Description', 50, 220);

      doc.fontSize(10).font('Helvetica')
        .text(`Webinar: ${invoiceData.webinarTitle}`, 50, 240);

      // Table Header
      doc.fontSize(10).font('Helvetica-Bold')
        .fillColor('#ffffff')
        .rect(50, 270, 500, 20).fill('#2563eb')
        .fillColor('#ffffff')
        .text('Description', 60, 275)
        .text('Amount (₹)', 450, 275, { width: 90, align: 'right' });

      // Table Rows
      let yPosition = 300;

      // Base Amount
      doc.fillColor('#000000')
        .text('Session Registration Fee', 60, yPosition)
        .text(invoiceData.baseAmount.toFixed(2), 450, yPosition, { width: 90, align: 'right' });
      yPosition += 20;

      // GST Rows
      if (invoiceData.gstDetails.type === 'CGST+SGST') {
        doc.text('CGST (9%)', 60, yPosition)
          .text(invoiceData.gstDetails.cgst.toFixed(2), 450, yPosition, { width: 90, align: 'right' });
        yPosition += 20;

        doc.text('SGST (9%)', 60, yPosition)
          .text(invoiceData.gstDetails.sgst.toFixed(2), 450, yPosition, { width: 90, align: 'right' });
        yPosition += 20;
      } else {
        doc.text('IGST (18%)', 60, yPosition)
          .text(invoiceData.gstDetails.igst.toFixed(2), 450, yPosition, { width: 90, align: 'right' });
        yPosition += 20;
      }

      // Total
      doc.font('Helvetica-Bold')
        .rect(50, yPosition, 500, 25).fill('#f0f9ff')
        .fillColor('#2563eb')
        .text('Total Amount', 60, yPosition + 7)
        .text(`₹ ${invoiceData.totalAmount.toFixed(2)}`, 450, yPosition + 7, { width: 90, align: 'right' });

      yPosition += 40;

      // GST Note
      doc.fontSize(9).font('Helvetica')
        .fillColor('#666666')
        .text(`GST Note: ${invoiceData.gstDetails.type === 'CGST+SGST' ?
          'CGST (9%) + SGST (9%) applied for Maharashtra state' :
          'IGST (18%) applied for other states'}`, 50, yPosition);

      yPosition += 20;

      // Footer
      doc.fontSize(8)
        .text('This is a computer-generated invoice. No signature required.', 50, yPosition, { align: 'center' });

      yPosition += 15;

      doc.text('For any queries, please contact support@ejobocean.com', 50, yPosition, { align: 'center' });

      yPosition += 30;

      // Terms and Conditions
      doc.fontSize(7)
        .text('Terms & Conditions:', 50, yPosition)
        .text('• This invoice is generated automatically upon successful payment.', 50, yPosition + 10)
        .text('• Please retain this invoice for your records.', 50, yPosition + 20)
        .text('• All amounts are in Indian Rupees (INR).', 50, yPosition + 30);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};


// GST Calculation Function (Same as frontend)
const calculateGST = (amount, state) => {
  const baseAmount = amount;

  // Check if state is Maharashtra
  const isMaharashtra = state === '4008' ||
    (typeof state === 'string' && state.toUpperCase() === 'MAHARASHTRA');

  if (isMaharashtra) {
    // CGST + SGST (9% each) = Total 18%
    const totalGST = baseAmount * 0.18;
    return {
      type: 'CGST+SGST',
      cgst: parseFloat((totalGST / 2).toFixed(2)),
      sgst: parseFloat((totalGST / 2).toFixed(2)),
      igst: 0,
      totalGST: parseFloat(totalGST.toFixed(2))
    };
  } else {
    // IGST (18%)
    const totalGST = baseAmount * 0.18;
    return {
      type: 'IGST',
      cgst: 0,
      sgst: 0,
      igst: parseFloat(totalGST.toFixed(2)),
      totalGST: parseFloat(totalGST.toFixed(2))
    };
  }
};




// Helper function to parse money values
const parseMoney = (val) => {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};

