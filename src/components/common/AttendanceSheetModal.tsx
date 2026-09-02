import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceSession, AttendanceRecord } from '../../types';
import { X, Printer, Download, FileSpreadsheet, CheckCircle2, Clock, Award, ShieldCheck } from 'lucide-react';

interface AttendanceSheetModalProps {
  session: AttendanceSession | null;
  records: AttendanceRecord[];
  onClose: () => void;
}

export const AttendanceSheetModal: React.FC<AttendanceSheetModalProps> = ({ session, records, onClose }) => {
  const { settings, issueCertificate, certificates, showToast } = useApp();

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!session) return null;

  const sessionRecords = records.filter(r => r.sessionId === session.id);
  const presentCount = sessionRecords.filter(r => r.status === 'Present').length;
  const lateCount = sessionRecords.filter(r => r.status === 'Late').length;
  const absentCount = sessionRecords.filter(r => r.status === 'Absent').length;
  const excusedCount = sessionRecords.filter(r => r.status === 'Excused').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['No.', 'Member ID', 'Full Name', 'Barangay', 'Time In', 'Status', 'Method', 'Remarks'];
    const rows = sessionRecords.map((r, index) => [
      index + 1,
      `"${r.memberId}"`,
      `"${r.memberName}"`,
      `"${r.memberBarangay}"`,
      `"${r.checkInTime}"`,
      `"${r.status}"`,
      `"${r.method}"`,
      `"${r.remarks || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${session.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${session.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('info', 'Export Complete', 'Attendance records exported to CSV.');
  };

  const handleGenerateCertificatesForPresent = () => {
    const attendees = sessionRecords.filter(r => r.status === 'Present' || r.status === 'Late');
    if (attendees.length === 0) {
      showToast('error', 'No Attendees Found', 'No present or late attendees found in this session.');
      return;
    }

    let issuedCount = 0;
    attendees.forEach(r => {
      const alreadyHas = certificates.some(c => 
        c.memberId === r.memberId && 
        (c.eventOrActivityTitle?.toLowerCase() === session.eventTitle.toLowerCase() || (c as any).eventTitle?.toLowerCase() === session.eventTitle.toLowerCase())
      );

      if (!alreadyHas) {
        issueCertificate({
          memberId: r.memberId,
          memberName: r.memberName,
          eventOrActivityTitle: session.eventTitle,
          certificateType: 'Participation',
          issueDate: session.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          organization: 'PAGASA Guimba Youth Organization',
          description: `For active and exemplary participation in the ${session.eventTitle} held on ${session.date} at ${session.location}.`,
          signatories: [
            { name: 'Gian Carlo Magat', position: 'President, PAGASA Guimba' },
            { name: 'Camille Joy Ramos', position: 'Secretariat & Attendance Head' }
          ]
        });
        issuedCount++;
      }
    });

    if (issuedCount > 0) {
      showToast('success', 'Certificates Generated', `Generated ${issuedCount} verifiable certificates for attendees.`);
    } else {
      showToast('info', 'Certificates Exist', 'All attendees already have generated certificates for this session.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 flex flex-col items-center justify-start min-h-screen"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Control Header Bar */}
        <div className="sticky top-0 z-20 p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-md no-print">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm block leading-tight">Official Municipal Attendance Sheet</span>
              <span className="text-[11px] text-slate-400">{session.eventTitle} ({session.date})</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleGenerateCertificatesForPresent}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Issue verifiable e-certificates to all present attendees"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Issue Certificates ({presentCount + lateCount})</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Official Printable Document */}
        <div className="p-6 sm:p-10 md:p-12 bg-white text-slate-900 space-y-6">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <p className="text-[11px] sm:text-xs uppercase tracking-widest text-slate-600 font-semibold">
              Republic of the Philippines • Province of Nueva Ecija • Municipality of Guimba
            </p>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-blue-950 font-display mt-1">
              {settings.orgName}
            </h1>
            <p className="text-xs font-bold text-slate-800 mt-1 uppercase tracking-widest">
              OFFICIAL ACTIVITY ATTENDANCE LOG SHEET
            </p>
          </div>

          {/* Event Details Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Event / Activity:</span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm">{session.eventTitle}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Date & Time:</span>
              <span className="font-bold text-slate-900">{session.date} ({session.startTime} – {session.endTime})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Venue / Location:</span>
              <span className="font-bold text-slate-900">{session.location}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block text-[11px]">Session Status:</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] mt-0.5 ${session.isOpen ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-800'}`}>
                {session.isOpen ? 'Active / Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Statistical Breakdown Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2.5 border border-slate-200 rounded-xl bg-slate-50/50">
              <span className="text-slate-500 block text-[10px] font-bold">TOTAL REGISTERED</span>
              <span className="text-lg font-bold text-slate-900 font-mono">{session.totalRegistered}</span>
            </div>
            <div className="p-2.5 border border-emerald-200 bg-emerald-50/70 rounded-xl">
              <span className="text-emerald-700 block text-[10px] font-bold">PRESENT</span>
              <span className="text-lg font-bold text-emerald-800 font-mono">{presentCount}</span>
            </div>
            <div className="p-2.5 border border-amber-200 bg-amber-50/70 rounded-xl">
              <span className="text-amber-700 block text-[10px] font-bold">LATE</span>
              <span className="text-lg font-bold text-amber-800 font-mono">{lateCount}</span>
            </div>
            <div className="p-2.5 border border-rose-200 bg-rose-50/70 rounded-xl">
              <span className="text-rose-700 block text-[10px] font-bold">ABSENT</span>
              <span className="text-lg font-bold text-rose-800 font-mono">{absentCount}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-2.5 border border-blue-200 bg-blue-50/70 rounded-xl">
              <span className="text-blue-700 block text-[10px] font-bold">ATTENDANCE RATE</span>
              <span className="text-lg font-bold text-blue-900 font-mono">{session.attendanceRate}%</span>
            </div>
          </div>

          {/* Records Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Barangay</th>
                  <th className="py-2.5 px-3">Time In</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Remarks / Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sessionRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      No attendance records logged yet for this session.
                    </td>
                  </tr>
                ) : (
                  sessionRecords.map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center text-slate-500 font-medium">{i + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-blue-800">{r.memberId}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{r.memberName}</td>
                      <td className="py-2 px-3 text-slate-600">Brgy. {r.memberBarangay}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{r.checkInTime}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                          r.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                          r.status === 'Excused' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[10px] text-slate-500">{r.method === 'QR_SCAN' ? 'QR Code' : 'Manual'}</td>
                      <td className="py-2 px-3 text-slate-500 italic">{r.remarks || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Official Signatures for Attendance Certification */}
          <div className="pt-8 grid grid-cols-2 gap-12 text-xs">
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                CAMILLE JOY RAMOS
              </div>
              <p className="text-[11px] text-slate-600">Attendance Officer / Secretariat Head</p>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-900 pb-1 mb-1 font-bold text-slate-900">
                GIAN CARLO MAGAT
              </div>
              <p className="text-[11px] text-slate-600">President, PAGASA Guimba Youth</p>
            </div>
          </div>
        </div>

        {/* Footer Close Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Municipality of Guimba Record Document</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
