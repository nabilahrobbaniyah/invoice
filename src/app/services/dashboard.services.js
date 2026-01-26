const pool = require("../../db/mysql");

async function getDashboardSummary(userId) {
  const [rows] = await pool.query(
    `
    SELECT
      COALESCE(SUM(
        CASE 
          WHEN status IN ('sent','paid')
           AND MONTH(invoice_date) = MONTH(CURRENT_DATE())
           AND YEAR(invoice_date) = YEAR(CURRENT_DATE())
          THEN total_amount
          ELSE 0
        END
      ), 0) AS total_invoice_this_month,

      COALESCE(SUM(
        CASE
          WHEN status = 'sent'
          THEN total_amount
          ELSE 0
        END
      ), 0) AS total_unpaid

    FROM invoices
    WHERE user_id = ?
    `,
    [userId]
  );

  return rows[0];
}

module.exports = {
  getDashboardSummary,
};
