package app.model;

import java.util.List;

public class EnrollmentStats {
    private int weeklyCount;
    private int monthlyCount;
    private List<Integer> dailyCounts; // last 7 days
    private List<String> dailyLabels;

    public EnrollmentStats() {}

    public int getWeeklyCount() { return weeklyCount; }
    public void setWeeklyCount(int weeklyCount) { this.weeklyCount = weeklyCount; }

    public int getMonthlyCount() { return monthlyCount; }
    public void setMonthlyCount(int monthlyCount) { this.monthlyCount = monthlyCount; }

    public List<Integer> getDailyCounts() { return dailyCounts; }
    public void setDailyCounts(List<Integer> dailyCounts) { this.dailyCounts = dailyCounts; }

    public List<String> getDailyLabels() { return dailyLabels; }
    public void setDailyLabels(List<String> dailyLabels) { this.dailyLabels = dailyLabels; }
}
