import React from 'react';
import { getAdminStats } from '../../services/adminService';
import toast from '../../components/dashboard/Toast';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminReports = () => {

  const generateReport = async (type, format) => {
    toast.success(`Generating ${type} report in ${format}...`);
    
    try {
      const stats = await getAdminStats();
      
      if (format === 'CSV') {
        const data = stats.revenueData.map(d => ({
          Day: d.name,
          Revenue: d.value
        }));
        
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${type}_report.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const doc = new jsPDF();
        doc.text(`Aura Eats - ${type} Report`, 14, 20);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
        
        const tableData = stats.revenueData.map(d => [d.name, `Rs. ${d.value}`]);
        
        doc.autoTable({
          startY: 35,
          head: [['Day', 'Revenue']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [20, 27, 43] },
        });
        
        doc.save(`${type.toLowerCase()}_report.pdf`);
      }
      
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const reports = [
    { title: 'Platform Financials', desc: 'Revenue, payouts, and commissions summary.', icon: 'account_balance' },
    { title: 'Vendor Performance', desc: 'Sales, ratings, and order volume by vendor.', icon: 'storefront' },
    { title: 'User Growth', desc: 'New registrations, active users, and retention.', icon: 'trending_up' },
    { title: 'Service Areas', desc: 'Order volume and profitability by geographic zone.', icon: 'map' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="font-headline-xl text-headline-xl text-primary-fixed mb-2">Reports & Exports</h2>
        <p className="text-on-primary-container font-body-md text-body-md">Generate and download comprehensive data reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-on-primary-container">
                <span className="material-symbols-outlined">{report.icon}</span>
              </div>
              <div>
                <h3 className="font-headline-lg text-lg text-white mb-1">{report.title}</h3>
                <p className="text-sm text-on-primary-container leading-relaxed">{report.desc}</p>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button 
                onClick={() => generateReport(report.title, 'CSV')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-label-md hover:bg-white/10 text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">text_snippet</span>
                Export CSV
              </button>
              <button 
                onClick={() => generateReport(report.title, 'PDF')}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-label-md hover:bg-white/10 text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
