import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import JSZip from "jszip";
import { getISOWeek } from "date-fns";
import { TbFileExport } from "react-icons/tb";
import { useSelector } from "react-redux";
import User from "../services/User";
import ExpenseReportService from "../services/ExpenseReport";
import TimeSlot from "../services/TimeSlot";

const ExportManager = ({ showAlert }) => {
    const [userInfo, setUserInfo] = useState(null);
    const selectedTimetable = useSelector((state) => state.timetable.selectedTimetable);

    useEffect(() => {
        const fetchUserInfo = async (id_user) => {
            try {
              const user = await User.fetchUser(id_user); 
              setUserInfo(user);

            } catch (error) {
              console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
            }
          };

          fetchUserInfo(selectedTimetable.id_user);
    }, [selectedTimetable?.id_user]);
   
    const exportToCSV = async (callback) => {
        if (!selectedTimetable || !selectedTimetable.daily_timetable_sheets) return;
      
        const csvRows = [];
        csvRows.push(`Employé : ${userInfo.first_name} ${userInfo.last_name}\n`);
        csvRows.push(`Mois;${selectedTimetable.month}/${selectedTimetable.year}\n`);
        csvRows.push("Jour;Début;Fin;Total heures jour;Total heures semaine;Total heures mois;Total notes de frais journée;Total commissions;Total notes de frais mensuel\n");
      
        let totalMonthlyHours = 0;
        let totalMonthlyExpenses = 0;
        let totalMonthlyCommissions = selectedTimetable.commission || 0;
        let weeklyHours = 0;
        let currentWeek = null;
      
        const sortedDailyTimetables = [...selectedTimetable.daily_timetable_sheets].sort(
          (a, b) => new Date(a.day) - new Date(b.day)
        );
      
        for (const daySheet of sortedDailyTimetables) {
          const date = new Date(daySheet.day);
          const day = date.toLocaleDateString("fr-FR");
          const timeSlots = await TimeSlot.getTimeSlotsByDailyTimetable(daySheet.id_daily_timetable) || [];
          const expenses = await ExpenseReportService.getExpenseReportsByDailyTimetable(daySheet.id_daily_timetable) || [];
      
          const dayTotalHours = timeSlots.reduce((total, slot) => {
            const [startHour, startMinute, startSecond] = slot.start.split(":").map(Number);
            const [endHour, endMinute, endSecond] = slot.end.split(":").map(Number);
      
            const start = new Date();
            start.setHours(startHour, startMinute, startSecond, 0);
      
            const end = new Date();
            end.setHours(endHour, endMinute, endSecond, 0);
      
            const hours = (end - start) / (1000 * 60 * 60);
            return total + hours;
          }, 0);
      
          totalMonthlyHours += dayTotalHours;
          const weekNumber = getISOWeek(date);
          if (currentWeek !== weekNumber) {
            currentWeek = weekNumber;
            weeklyHours = 0;
          }
          weeklyHours += dayTotalHours;
      
          const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0;
          totalMonthlyExpenses += expenseTotal;
      
          if (timeSlots.length > 0) {
            timeSlots.forEach((slot) => {
              csvRows.push(`${day};${slot.start};${slot.end};${dayTotalHours.toFixed(2)};${weeklyHours.toFixed(2)};${totalMonthlyHours.toFixed(2)};${expenseTotal.toFixed(2)};${totalMonthlyCommissions.toFixed(2)};${totalMonthlyExpenses.toFixed(2)}\n`);
            });
          } else {
            csvRows.push(`${day};;;0.00;${weeklyHours.toFixed(2)};${totalMonthlyHours.toFixed(2)};${expenseTotal.toFixed(2)};${totalMonthlyCommissions.toFixed(2)};${totalMonthlyExpenses.toFixed(2)}\n`);
          }
        }
      
        const csvContent = csvRows.join("");
        callback(csvContent);
      };   
    
      const exportToPDF = async (callback) => {
        if (!selectedTimetable || !selectedTimetable.daily_timetable_sheets) return;
      
        const doc = new jsPDF();
        const title = `Employé : ${userInfo.first_name} ${userInfo.last_name} - ${selectedTimetable.month}/${selectedTimetable.year}`;
        doc.text(title, 14, 10);
      
        let totalMonthlyHours = 0;
        let totalMonthlyExpenses = 0;
        let totalMonthlyCommissions = selectedTimetable.commission || 0;
      
        let weeklyHours = 0;
        let currentWeek = null;
      
        const sortedDailyTimetables = [...selectedTimetable.daily_timetable_sheets].sort(
          (a, b) => new Date(a.day) - new Date(b.day)
        );
      
        let maxTimeSlots = 0;
        for (const daySheet of sortedDailyTimetables) {
          const timeSlots = await TimeSlot.getTimeSlotsByDailyTimetable(daySheet.id_daily_timetable);
          if (timeSlots.length > maxTimeSlots) {
            maxTimeSlots = timeSlots.length;
          }
        }
      
        const timeSlotColumns = [];
        for (let i = 1; i <= maxTimeSlots; i++) {
          timeSlotColumns.push(`Début ${i}`, `Fin ${i}`);
        }
      
        const tableColumns = [
          "Jour",
          ...timeSlotColumns,
          "Total heures jour",
          "Total heures semaine",
          "Total heures mois",
          "Total notes de frais journée",
          "Total notes de frais mensuel"
        ];
      
        const tableRows = [];
      
        for (const daySheet of sortedDailyTimetables) {
          const date = new Date(daySheet.day);
          const day = date.toLocaleDateString("fr-FR");
          const timeSlots = await TimeSlot.getTimeSlotsByDailyTimetable(daySheet.id_daily_timetable) || [];
          const expenses = await ExpenseReportService.getExpenseReportsByDailyTimetable(daySheet.id_daily_timetable) || [];
      
          const dayTotalHours = timeSlots.reduce((total, slot) => {
            const [startHour, startMinute, startSecond] = slot.start.split(":").map(Number);
            const [endHour, endMinute, endSecond] = slot.end.split(":").map(Number);
      
            const start = new Date();
            start.setHours(startHour, startMinute, startSecond, 0);
      
            const end = new Date();
            end.setHours(endHour, endMinute, endSecond, 0);
      
            const hours = (end - start) / (1000 * 60 * 60);
            return total + hours;
          }, 0);
      
          totalMonthlyHours += dayTotalHours;
          const weekNumber = getISOWeek(date);
          if (currentWeek !== weekNumber) {
            currentWeek = weekNumber;
            weeklyHours = 0;
          }
          weeklyHours += dayTotalHours;
      
          const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0) || 0;
          totalMonthlyExpenses += expenseTotal;
      
          const timeSlotColumnsData = [];
          timeSlots.forEach((slot) => {
            timeSlotColumnsData.push(slot.start, slot.end);
          });
      
          while (timeSlotColumnsData.length < maxTimeSlots * 2) {
            timeSlotColumnsData.push("", "");
          }
      
          const row = [
            day,
            ...timeSlotColumnsData,
            dayTotalHours.toFixed(2),
            weeklyHours.toFixed(2),
            totalMonthlyHours.toFixed(2),
            expenseTotal.toFixed(2),
            totalMonthlyExpenses.toFixed(2)
          ];
          tableRows.push(row);
        }
      
        doc.autoTable({
          head: [tableColumns],
          body: tableRows,
          startY: 20,
          theme: "grid",
          headStyles: { fillColor: [0, 0, 128] },
          styles: { fontSize: 8, cellPadding: 2 },
        });
      
        doc.setFontSize(10); 
        doc.setTextColor(128, 128, 128); 
      
        doc.text(`Total heures mensuelles : ${totalMonthlyHours.toFixed(2)} heures`, 14, doc.lastAutoTable.finalY + 10);
        doc.text(`Total notes de frais mensuelles : ${totalMonthlyExpenses.toFixed(2)} CHF`, 14, doc.lastAutoTable.finalY + 16);
        doc.text(`Total commissions mensuelles : ${totalMonthlyCommissions.toFixed(2)} CHF`, 14, doc.lastAutoTable.finalY + 22);
      
        doc.setFontSize(12); 
        doc.setTextColor(0, 0, 0); 
      
        const pdfBlob = doc.output("blob");
        callback(pdfBlob);
      };  
      
      const exportToZip = async () => {
        if (!selectedTimetable || !selectedTimetable.daily_timetable_sheets) return;
      
        showAlert("Exportation en cours...", "warning");
      
        const zip = new JSZip();
      
        const csvPromise = new Promise((resolve) => {
          exportToCSV((csvContent) => {
            zip.file(`Mensual_Timetable_${userInfo.first_name}_${userInfo.last_name}_${selectedTimetable.month}_${selectedTimetable.year}.csv`, csvContent);
            resolve();
          });
        });
      
        const pdfPromise = new Promise((resolve) => {
          exportToPDF((pdfBlob) => {
            zip.file(`Mensual_Timetable_${userInfo.first_name}_${userInfo.last_name}_${selectedTimetable.month}_${selectedTimetable.year}.pdf`, pdfBlob);
            resolve();
          });
        });
      
        await Promise.all([csvPromise, pdfPromise]);
      
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(content, `Mensual_Timetable_${selectedTimetable.month}_${selectedTimetable.year}.zip`);
          
          showAlert("Exportation terminée avec succès", "success");
        }).catch(() => {
          showAlert("Erreur lors de l'exportation", "error");
        });
      }; 

  return (
      <button className="export" onClick={exportToZip} title="Exporter en pdf/csv">
        <TbFileExport size={20}/>
      </button>
  );
};

export default ExportManager;
