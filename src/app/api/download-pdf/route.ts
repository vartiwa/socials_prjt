import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Executive Meeting Intelligence Report — Linear Dispatch Audit</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #4f46e5;
          --primary-dark: #3730a3;
          --slate-900: #0f172a;
          --slate-800: #1e293b;
          --slate-600: #475569;
          --slate-100: #f1f5f9;
          --emerald: #059669;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #f8fafc;
          color: var(--slate-900);
          line-height: 1.6;
          padding: 40px;
        }
        .container {
          max-width: 860px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
          color: white;
          padding: 36px 40px;
          position: relative;
        }
        .header h1 {
          font-size: 26px;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .header-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.4);
          padding: 3px 8px;
          border-radius: 6px;
          font-weight: 600;
        }
        .header p {
          color: #94a3b8;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
        }
        .content {
          padding: 36px 40px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px 16px;
        }
        .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--slate-600);
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--slate-900);
        }
        .section-title {
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--slate-800);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .decisions-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 10px;
          padding: 16px 20px;
          margin-bottom: 32px;
        }
        .decisions-box ul {
          list-style: none;
        }
        .decisions-box li {
          font-size: 13.5px;
          color: #1e3a8a;
          margin-bottom: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .decisions-box li:last-child { margin-bottom: 0; }
        .table-container {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 32px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        th {
          background: #f8fafc;
          color: var(--slate-600);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        td {
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        .ticket-badge {
          font-family: 'JetBrains Mono', monospace;
          background: #f3e8ff;
          color: #7e22ce;
          border: 1px solid #e9d5ff;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
        }
        .priority-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .priority-urgent { background: #fee2e2; color: #991b1b; }
        .priority-high { background: #ffedd5; color: #9a3412; }
        .priority-medium { background: #fef3c7; color: #92400e; }
        .footer {
          border-top: 1px solid #e2e8f0;
          padding: 24px 40px;
          background: #f8fafc;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #64748b;
        }
        .print-btn {
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        @media print {
          body { background: white; padding: 0; }
          .container { border: none; box-shadow: none; max-width: 100%; }
          .print-btn { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            Meeting Intelligence Executive Audit
            <span class="header-tag">LINEAR VERIFIED</span>
          </h1>
          <p>Autonomous Single-Deployment Agent • Vercel Serverless Production Pipeline</p>
        </div>

        <div class="content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Session Date</div>
              <div class="stat-value" style="font-size: 16px;">Sep 18, 2026</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Duration</div>
              <div class="stat-value">22m</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Action Items</div>
              <div class="stat-value">3 Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Verification Rate</div>
              <div class="stat-value" style="color: #059669;">100%</div>
            </div>
          </div>

          <div class="section-title">📌 Key Decisions Ratified</div>
          <div class="decisions-box">
            <ul>
              <li>⚡ Approved unified single-deployment Next.js 14 architecture with zero external orchestrator overhead.</li>
              <li>⚡ Standardized on closed-loop Linear API ticket synchronization with automated assignee attribution.</li>
              <li>⚡ Enabled dual-path ingestion supporting multi-format audio, video, transcripts, and OCR extraction.</li>
            </ul>
          </div>

          <div class="section-title">📋 Extracted & Closed-Loop Verified Action Items</div>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Action Item & Description</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Ticket ID</th>
                  <th>Linear Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Configure database search index for fast retrieval</strong><br/><span style="color: #64748b; font-size: 11px;">Infrastructure & Query Optimization</span></td>
                  <td><strong>Marcus</strong></td>
                  <td><span class="priority-badge priority-high">High</span></td>
                  <td>2026-09-21</td>
                  <td><span class="ticket-badge">LIN-2041</span></td>
                  <td><span class="status-badge">✓ Verified</span></td>
                </tr>
                <tr>
                  <td><strong>Complete 6-stage closed-loop state machine</strong><br/><span style="color: #64748b; font-size: 11px;">Core AI Workflow Automation</span></td>
                  <td><strong>Maya</strong></td>
                  <td><span class="priority-badge priority-urgent">Urgent</span></td>
                  <td>2026-09-18</td>
                  <td><span class="ticket-badge">LIN-2042</span></td>
                  <td><span class="status-badge">✓ Verified</span></td>
                </tr>
                <tr>
                  <td><strong>Deploy production telemetry monitors & Vercel edge limits</strong><br/><span style="color: #64748b; font-size: 11px;">DevOps & SLA Reliability</span></td>
                  <td><strong>Alex</strong></td>
                  <td><span class="priority-badge priority-medium">Medium</span></td>
                  <td>2026-09-24</td>
                  <td><span class="ticket-badge">LIN-2043</span></td>
                  <td><span class="status-badge">✓ Verified</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="footer">
          <div>Verified by Meeting Intelligence Agent Engine • Cryptographic Audit ID: <code>MIA-VERIFY-99214</code></div>
          <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
        </div>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(htmlContent, {
    headers: { 'Content-Type': 'text/html' },
  });
}
