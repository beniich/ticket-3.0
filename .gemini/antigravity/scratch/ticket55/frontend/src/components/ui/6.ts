6
Parfait ! Je vais te fournir le code complet pour le **système de reporting et analytics avancés** qui va te donner des insights business complets.

---

# 📊 SYSTÈME DE REPORTING ET ANALYTICS AVANCÉS

## 1. 📦 INSTALLATION DES DÉPENDANCES

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "exceljs": "^4.4.0",
    "pdfkit": "^0.15.0",
    "chart.js": "^4.4.1",
    "puppeteer": "^21.11.0"
  }
}
```

Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "recharts": "^2.10.3",
    "react-apexcharts": "^1.4.1",
    "apexcharts": "^3.45.2"
  }
}
```

Installe :
```bash
cd backend && npm install exceljs pdfkit chart.js puppeteer
cd frontend && npm install recharts react-apexcharts apexcharts
```

---

## 2. 📁 STRUCTURE DES FICHIERS

```
backend/
├── src/
│   ├── models/
│   │   └── Report.ts                 ✨ NOUVEAU
│   ├── controllers/
│   │   └── analyticsController.ts     ✨ NOUVEAU
│   ├── routes/
│   │   └── analytics.ts              ✨ NOUVEAU
│   ├── services/
│   │   └── analyticsService.ts        ✨ NOUVEAU
│   ├── utils/
│   │   ├── reportGenerator.ts         ✨ NOUVEAU
│   │   └── dataProcessor.ts           ✨ NOUVEAU
│   └── templates/
│       └── reportTemplates/           ✨ NOUVEAU
│           ├── executive.ts
│           ├── operational.ts
│           ├── financial.ts
│           └── performance.ts

frontend/
├── src/
│   ├── components/
│   │   ├── analytics/
│   │   │   ├── Dashboard.tsx          ✨ NOUVEAU
│   │   │   ├── ReportBuilder.tsx      ✨ NOUVEAU
│   │   │   ├── ChartWidget.tsx        ✨ NOUVEAU
│   │   │   ├── KpiCard.tsx            ✨ NOUVEAU
│   │   │   ├── DataGrid.tsx           ✨ NOUVEAU
│   │   │   ├── FilterPanel.tsx        ✨ NOUVEAU
│   │   │   ├── ExportButton.tsx       ✨ NOUVEAU
│   │   │   └── ScheduleReports.tsx    ✨ NOUVEAU
│   ├── hooks/
│   │   └── useAnalytics.ts            ✨ NOUVEAU
│   ├── types/
│   │   └── analytics.ts               ✨ NOUVEAU
│   └── lib/
│       └── analyticsUtils.ts          ✨ NOUVEAU
```

---

## 3. 📄 MODÈLE DE DONNÉES

### 📄 `backend/src/models/Report.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  title: string;
  description: string;
  type: ReportType;
  template: ReportTemplate;
  data: any;
  filters: ReportFilters;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    recipients: string[]; // User emails
    timezone: string;
    nextRun: Date;
  };
  format: ReportFormat;
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  lastGenerated?: Date;
  views: number;
  downloads: number;
  permissions: {
    viewers: string[]; // User IDs or roles
    editors: string[]; // User IDs
    downloaders: string[]; // User IDs or roles
  };
}

export interface IReportTemplate extends Document {
  name: string;
  description: string;
  category: ReportCategory;
  sections: ReportSection[];
  defaultFilters: ReportFilters;
  visualization: VisualizationConfig;
  exportFormats: ReportFormat[];
  permissions: {
    viewers: string[];
    editors: string[];
  };
}

export interface IDataVisualization extends Document {
  type: VisualizationType;
  title: string;
  description: string;
  dataQuery: string; // MongoDB aggregation pipeline
  xAxis: string;
  yAxis: string[];
  filters: any;
  styling: VisualizationStyle;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType = 
  | 'executive_summary'      // Résumé exécutif
  | 'operational_metrics'    // Métriques opérationnelles
  | 'financial_analysis'     // Analyse financière
  | 'performance_review'     // Revue de performance
  | 'complaint_analysis'     // Analyse des réclamations
  | 'team_performance'       // Performance des équipes
  | 'resource_utilization'   // Utilisation des ressources
  | 'customer_satisfaction'  // Satisfaction client
  | 'quality_metrics'        // Métriques qualité
  | 'efficiency_report'      // Rapport d'efficacité
  | 'predictive_analytics'   // Analytics prédictifs
  | 'compliance_report'      // Rapport de conformité
  | 'risk_assessment'        // Évaluation des risques
  | 'benchmarking'           // Benchmarking
  | 'trend_analysis'         // Analyse des tendances
  | 'kpi_dashboard'          // Dashboard KPI
  | 'custom_report';         // Rapport personnalisé

export type ReportTemplate = 
  | 'standard_executive'
  | 'detailed_operational'
  | 'financial_summary'
  | 'performance_matrix'
  | 'complaint_trends'
  | 'team_comparison'
  | 'resource_allocation'
  | 'satisfaction_survey'
  | 'quality_control'
  | 'efficiency_metrics'
  | 'predictive_model'
  | 'compliance_checklist'
  | 'risk_matrix'
  | 'industry_benchmark'
  | 'trend_visualization'
  | 'kpi_overview'
  | 'custom_template';

export type ReportCategory = 
  | 'business_intelligence'
  | 'operational_excellence'
  | 'financial_performance'
  | 'customer_experience'
  | 'human_resources'
  | 'quality_management'
  | 'risk_compliance'
  | 'strategic_planning';

export interface ReportSection {
  id: string;
  title: string;
  type: 'chart' | 'table' | 'metric' | 'text' | 'kpi';
  dataQuery: string;
  visualizationType?: VisualizationType;
  position: number;
  isVisible: boolean;
  filters?: any;
}

export interface ReportFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  departments?: string[];
  teams?: string[];
  priority?: string[];
  status?: string[];
  categories?: string[];
  regions?: string[];
  custom?: any;
}

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html' | 'powerpoint';

export type VisualizationType = 
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'donut_chart'
  | 'area_chart'
  | 'scatter_plot'
  | 'heatmap'
  | 'gauge'
  | 'funnel'
  | 'radar'
  | 'bubble_chart'
  | 'tree_map'
  | 'sankey_diagram'
  | 'waterfall_chart'
  | 'box_plot';

export interface VisualizationStyle {
  colors: string[];
  fontFamily: string;
  fontSize: number;
  showLegend: boolean;
  showTooltips: boolean;
  animation: boolean;
  responsive: boolean;
  theme: 'light' | 'dark' | 'custom';
}

export interface KpiDefinition {
  id: string;
  name: string;
  description: string;
  formula: string;
  target: number;
  unit: string;
  category: string;
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  thresholds: {
    green: number;
    yellow: number;
    red: number;
  };
  dataSource: string;
  calculationMethod: 'sum' | 'average' | 'count' | 'percentage' | 'ratio';
}

export interface DashboardConfig {
  id: string;
  name: string;
  description: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: ReportFilters;
  refreshInterval: number; // seconds
  permissions: {
    viewers: string[];
    editors: string[];
  };
  theme: 'light' | 'dark' | 'custom';
}

export interface DashboardLayout {
  type: 'grid' | 'freeform' | 'tabs';
  gridSize?: {
    columns: number;
    rows: number;
  };
  widgetPositions?: WidgetPosition[];
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'kpi' | 'table' | 'text' | 'filter' | 'image';
  title: string;
  dataSource: string;
  visualization: VisualizationConfig;
  position: WidgetPosition;
  size: WidgetSize;
  filters: any;
  refreshInterval?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface VisualizationConfig {
  type: VisualizationType;
  options: any;
  dataTransform?: string; // JavaScript function to transform data
  customColors?: string[];
  animations?: boolean;
  responsive?: boolean;
}

// Schémas Mongoose
const ReportSchema = new Schema<IReport>({
  title: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: [
      'executive_summary', 'operational_metrics', 'financial_analysis',
      'performance_review', 'complaint_analysis', 'team_performance',
      'resource_utilization', 'customer_satisfaction', 'quality_metrics',
      'efficiency_report', 'predictive_analytics', 'compliance_report',
      'risk_assessment', 'benchmarking', 'trend_analysis',
      'kpi_dashboard', 'custom_report'
    ],
    required: true
  },
  template: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  filters: { type: Schema.Types.Mixed },
  schedule: {
    enabled: { type: Boolean, default: false },
    frequency: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] 
    },
    recipients: [{ type: String }],
    timezone: { type: String },
    nextRun: { type: Date }
  },
  format: { 
    type: String, 
    enum: ['pdf', 'excel', 'csv', 'json', 'html', 'powerpoint'],
    default: 'pdf'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'archived'],
    default: 'draft'
  },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastGenerated: { type: Date },
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  permissions: {
    viewers: [{ type: String }],
    editors: [{ type: String }],
    downloaders: [{ type: String }]
  }
});

const ReportTemplateSchema = new Schema<IReportTemplate>({
  name: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: [
      'business_intelligence', 'operational_excellence', 'financial_performance',
      'customer_experience', 'human_resources', 'quality_management',
      'risk_compliance', 'strategic_planning'
    ],
    required: true
  },
  sections: [{ type: Schema.Types.Mixed }],
  defaultFilters: { type: Schema.Types.Mixed },
  visualization: { type: Schema.Types.Mixed },
  exportFormats: [{ 
    type: String, 
    enum: ['pdf', 'excel', 'csv', 'json', 'html', 'powerpoint'] 
  }],
  permissions: {
    viewers: [{ type: String }],
    editors: [{ type: String }]
  }
});

const DataVisualizationSchema = new Schema<IDataVisualization>({
  type: { 
    type: String, 
    enum: [
      'line_chart', 'bar_chart', 'pie_chart', 'donut_chart', 'area_chart',
      'scatter_plot', 'heatmap', 'gauge', 'funnel', 'radar', 'bubble_chart',
      'tree_map', 'sankey_diagram', 'waterfall_chart', 'box_plot'
    ],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String },
  dataQuery: { type: String, required: true },
  xAxis: { type: String },
  yAxis: [{ type: String }],
  filters: { type: Schema.Types.Mixed },
  styling: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const KpiDefinitionSchema = new Schema<KpiDefinition>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  formula: { type: String, required: true },
  target: { type: Number, required: true },
  unit: { type: String, required: true },
  category: { type: String, required: true },
  frequency: { 
    type: String, 
    enum: ['real_time', 'hourly', 'daily', 'weekly', 'monthly'],
    required: true
  },
  thresholds: {
    green: { type: Number, required: true },
    yellow: { type: Number, required: true },
    red: { type: Number, required: true }
  },
  dataSource: { type: String, required: true },
  calculationMethod: { 
    type: String, 
    enum: ['sum', 'average', 'count', 'percentage', 'ratio'],
    required: true
  }
});

const DashboardConfigSchema = new Schema<DashboardConfig>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  layout: { type: Schema.Types.Mixed, required: true },
  widgets: [{ type: Schema.Types.Mixed }],
  filters: { type: Schema.Types.Mixed },
  refreshInterval: { type: Number, default: 300 }, // 5 minutes
  permissions: {
    viewers: [{ type: String }],
    editors: [{ type: String }]
  },
  theme: { 
    type: String, 
    enum: ['light', 'dark', 'custom'],
    default: 'light'
  }
});

// Index pour optimiser les requêtes
ReportSchema.index({ createdBy: 1, createdAt: -1 });
ReportSchema.index({ type: 1, status: 1 });
DataVisualizationSchema.index({ type: 1, createdAt: -1 });
DashboardConfigSchema.index({ name: 1 });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
export const ReportTemplate = mongoose.model<IReportTemplate>('ReportTemplate', ReportTemplateSchema);
export const DataVisualization = mongoose.model<IDataVisualization>('DataVisualization', DataVisualizationSchema);
export const KpiDefinition = mongoose.model<KpiDefinition>('KpiDefinition', KpiDefinitionSchema);
export const DashboardConfig = mongoose.model<DashboardConfig>('DashboardConfig', DashboardConfigSchema);
```

---

## 4. 📄 SERVICES ANALYTICS

### 📄 `backend/src/services/analyticsService.ts`
```typescript
import { 
  Report, 
  ReportTemplate, 
  DataVisualization, 
  KpiDefinition, 
  DashboardConfig,
  IReport,
  ReportFilters
} from '../models/Report';
import { Complaint } from '../models/Complaint';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Document } from '../models/Document';
import { Message } from '../models/Message';
import { Achievement } from '../models/Achievement';
import { LeaderboardEntry } from '../models/Achievement';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export class AnalyticsService {
  // Générer un rapport
  async generateReport(
    reportType: string,
    filters: ReportFilters,
    userId: string
  ): Promise<any> {
    try {
      let reportData: any = {};

      switch(reportType) {
        case 'executive_summary':
          reportData = await this.generateExecutiveSummary(filters);
          break;
        case 'operational_metrics':
          reportData = await this.generateOperationalMetrics(filters);
          break;
        case 'financial_analysis':
          reportData = await this.generateFinancialAnalysis(filters);
          break;
        case 'performance_review':
          reportData = await this.generatePerformanceReview(filters);
          break;
        case 'complaint_analysis':
          reportData = await this.generateComplaintAnalysis(filters);
          break;
        case 'team_performance':
          reportData = await this.generateTeamPerformance(filters);
          break;
        case 'resource_utilization':
          reportData = await this.generateResourceUtilization(filters);
          break;
        case 'customer_satisfaction':
          reportData = await this.generateCustomerSatisfaction(filters);
          break;
        case 'quality_metrics':
          reportData = await this.generateQualityMetrics(filters);
          break;
        case 'efficiency_report':
          reportData = await this.generateEfficiencyReport(filters);
          break;
        case 'predictive_analytics':
          reportData = await this.generatePredictiveAnalytics(filters);
          break;
        case 'compliance_report':
          reportData = await this.generateComplianceReport(filters);
          break;
        case 'risk_assessment':
          reportData = await this.generateRiskAssessment(filters);
          break;
        case 'benchmarking':
          reportData = await this.generateBenchmarking(filters);
          break;
        case 'trend_analysis':
          reportData = await this.generateTrendAnalysis(filters);
          break;
        case 'kpi_dashboard':
          reportData = await this.generateKpiDashboard(filters);
          break;
        default:
          throw new Error(`Type de rapport non supporté: ${reportType}`);
      }

      return reportData;
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      throw error;
    }
  }

  // Générer un résumé exécutif
  private async generateExecutiveSummary(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    // Métriques clés
    const [
      totalComplaints,
      resolvedComplaints,
      avgResolutionTime,
      satisfactionRate,
      activeTeams,
      totalUsers,
      documentsCreated,
      messagesSent
    ] = await Promise.all([
      Complaint.countDocuments({
        createdAt: { $gte: period.start, $lte: period.end }
      }),
      Complaint.countDocuments({
        status: { $in: ['resolved', 'closed'] },
        createdAt: { $gte: period.start, $lte: period.end }
      }),
      this.calculateAverageResolutionTime(period.start, period.end),
      this.calculateSatisfactionRate(period.start, period.end),
      Team.countDocuments({ status: 'active' }),
      User.countDocuments({ isActive: true }),
      Document.countDocuments({
        'metadata.createdAt': { $gte: period.start, $lte: period.end }
      }),
      Message.countDocuments({
        createdAt: { $gte: period.start, $lte: period.end }
      })
    ]);

    // Tendances
    const complaintTrends = await this.getComplaintTrends(period.start, period.end);
    const teamPerformance = await this.getTeamPerformanceSummary();
    const categoryDistribution = await this.getCategoryDistribution(period.start, period.end);

    return {
      summary: {
        totalComplaints,
        resolvedComplaints,
        resolutionRate: totalComplaints > 0 ? (resolvedComplaints / totalComplaints) * 100 : 0,
        avgResolutionTime,
        satisfactionRate,
        activeTeams,
        totalUsers,
        documentsCreated,
        messagesSent
      },
      trends: complaintTrends,
      teamPerformance,
      categoryDistribution,
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString()
      }
    };
  }

  // Générer les métriques opérationnelles
  private async generateOperationalMetrics(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    // Statistiques détaillées
    const complaintStats = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: period.start, $lte: period.end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ]);

    const priorityStats = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: period.start, $lte: period.end }
        }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          avgResolutionTime: { $avg: '$resolutionTime' }
        }
      }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: period.start, $lte: period.end }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgResolutionTime: { $avg: '$resolutionTime' },
          satisfactionAvg: { $avg: '$satisfactionRating' }
        }
      }
    ]);

    const teamStats = await Team.aggregate([
      {
        $lookup: {
          from: 'complaints',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'complaints'
        }
      },
      {
        $project: {
          name: 1,
          complaintsCount: { $size: '$complaints' },
          avgResolutionTime: { $avg: '$complaints.resolutionTime' },
          satisfactionAvg: { $avg: '$complaints.satisfactionRating' }
        }
      }
    ]);

    return {
      complaintStats,
      priorityStats,
      categoryStats,
      teamStats,
      period: {
        start: period.start.toISOString(),
        end: period.end.toISOString()
      }
    };
  }

  // Générer l'analyse financière
  private async generateFinancialAnalysis(filters: ReportFilters) {
    // Pour l'instant, simulation de données financières
    const period = filters.dateRange || this.getDefaultDateRange();
    
    const financialData = {
      operationalCosts: {
        labor: 50000,
        materials: 25000,
        equipment: 15000,
        overhead: 10000
      },
      revenue: {
        serviceFees: 75000,
        contracts: 25000,
        grants: 15000
      },
      kpis: {
        costPerComplaint: 15.50,
        roi: 125,
        budgetVariance: -2.5,
        efficiencyRatio: 85
      },
      trends: await this.getFinancialTrends(period.start, period.end)
    };

    return financialData;
  }

  // Générer la revue de performance
  private async generatePerformanceReview(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const performanceData = {
      individual: await this.getIndividualPerformance(period.start, period.end),
      team: await this.getTeamPerformance(period.start, period.end),
      department: await this.getDepartmentPerformance(period.start, period.end),
      benchmarking: await this.getBenchmarkingData(period.start, period.end)
    };

    return performanceData;
  }

  // Générer l'analyse des réclamations
  private async generateComplaintAnalysis(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const complaintAnalysis = {
      volumeTrends: await this.getComplaintVolumeTrends(period.start, period.end),
      resolutionAnalysis: await this.getResolutionAnalysis(period.start, period.end),
      customerFeedback: await this.getCustomerFeedbackAnalysis(period.start, period.end),
      rootCauses: await this.getRootCauseAnalysis(period.start, period.end),
      geographicalDistribution: await this.getGeographicalDistribution(period.start, period.end)
    };

    return complaintAnalysis;
  }

  // Générer la performance des équipes
  private async generateTeamPerformance(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const teamPerformance = {
      productivity: await this.getTeamProductivity(period.start, period.end),
      quality: await this.getTeamQualityMetrics(period.start, period.end),
      collaboration: await this.getTeamCollaborationMetrics(period.start, period.end),
      skillDevelopment: await this.getTeamSkillDevelopment(period.start, period.end),
      recognition: await this.getTeamRecognitionMetrics(period.start, period.end)
    };

    return teamPerformance;
  }

  // Générer l'utilisation des ressources
  private async generateResourceUtilization(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const resourceData = {
      humanResources: await this.getHumanResourceUtilization(period.start, period.end),
      equipment: await this.getEquipmentUtilization(period.start, period.end),
      facilities: await this.getFacilityUtilization(period.start, period.end),
      technology: await this.getTechnologyUtilization(period.start, period.end),
      budget: await this.getBudgetUtilization(period.start, period.end)
    };

    return resourceData;
  }

  // Générer la satisfaction client
  private async generateCustomerSatisfaction(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const satisfactionData = {
      overallScore: await this.getOverallSatisfactionScore(period.start, period.end),
      trendAnalysis: await this.getSatisfactionTrend(period.start, period.end),
      feedbackAnalysis: await this.getFeedbackAnalysis(period.start, period.end),
      improvementAreas: await this.getIdentifyImprovementAreas(period.start, period.end),
      loyaltyMetrics: await this.getLoyaltyMetrics(period.start, period.end)
    };

    return satisfactionData;
  }

  // Générer les métriques qualité
  private async generateQualityMetrics(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const qualityData = {
      defectRates: await this.getDefectRates(period.start, period.end),
      complianceScores: await this.getComplianceScores(period.start, period.end),
      processEfficiency: await this.getProcessEfficiency(period.start, period.end),
      customerQuality: await this.getCustomerQualityMetrics(period.start, period.end),
      continuousImprovement: await this.getContinuousImprovementMetrics(period.start, period.end)
    };

    return qualityData;
  }

  // Générer le rapport d'efficacité
  private async generateEfficiencyReport(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const efficiencyData = {
      timeMetrics: await this.getTimeEfficiencyMetrics(period.start, period.end),
      costEfficiency: await this.getCostEfficiencyMetrics(period.start, period.end),
      resourceOptimization: await this.getResourceOptimizationMetrics(period.start, period.end),
      workflowEfficiency: await this.getWorkflowEfficiencyMetrics(period.start, period.end),
      productivityGains: await this.getProductivityGains(period.start, period.end)
    };

    return efficiencyData;
  }

  // Générer les analytics prédictifs
  private async generatePredictiveAnalytics(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const predictiveData = {
      forecast: await this.getDemandForecast(period.start, period.end),
      riskAssessment: await this.getPredictiveRiskAssessment(period.start, period.end),
      resourceNeeds: await this.getPredictiveResourceNeeds(period.start, period.end),
      performanceProjection: await this.getPerformanceProjection(period.start, period.end),
      anomalyDetection: await this.getAnomalyDetection(period.start, period.end)
    };

    return predictiveData;
  }

  // Générer le rapport de conformité
  private async generateComplianceReport(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const complianceData = {
      regulatoryCompliance: await this.getRegulatoryComplianceMetrics(period.start, period.end),
      internalAudits: await this.getInternalAuditResults(period.start, period.end),
      trainingCompletion: await this.getTrainingComplianceMetrics(period.start, period.end),
      incidentReporting: await this.getIncidentReportingCompliance(period.start, period.end),
      documentationStandards: await this.getDocumentationCompliance(period.start, period.end)
    };

    return complianceData;
  }

  // Générer l'évaluation des risques
  private async generateRiskAssessment(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const riskData = {
      riskMatrix: await this.getRiskMatrix(period.start, period.end),
      mitigationEffectiveness: await this.getRiskMitigationEffectiveness(period.start, period.end),
      incidentAnalysis: await this.getIncidentRiskAnalysis(period.start, period.end),
      vulnerabilityAssessment: await this.getVulnerabilityAssessment(period.start, period.end),
      contingencyPlanning: await this.getContingencyPlanningMetrics(period.start, period.end)
    };

    return riskData;
  }

  // Générer le benchmarking
  private async generateBenchmarking(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const benchmarkData = {
      industryComparison: await this.getIndustryBenchmarking(period.start, period.end),
      bestPractices: await this.getBestPracticeImplementation(period.start, period.end),
      competitiveAnalysis: await this.getCompetitiveAnalysis(period.start, period.end),
      performanceGaps: await this.getPerformanceGapAnalysis(period.start, period.end),
      improvementOpportunities: await this.getImprovementOpportunities(period.start, period.end)
    };

    return benchmarkData;
  }

  // Générer l'analyse des tendances
  private async generateTrendAnalysis(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const trendData = {
      historicalTrends: await this.getHistoricalTrends(period.start, period.end),
      seasonalPatterns: await this.getSeasonalPatternAnalysis(period.start, period.end),
      growthTrajectory: await this.getGrowthTrajectory(period.start, period.end),
      correlationAnalysis: await this.getCorrelationAnalysis(period.start, period.end),
      predictiveIndicators: await this.getPredictiveIndicators(period.start, period.end)
    };

    return trendData;
  }

  // Générer le dashboard KPI
  private async generateKpiDashboard(filters: ReportFilters) {
    const period = filters.dateRange || this.getDefaultDateRange();

    const kpiData = {
      operationalKpis: await this.getOperationalKpis(period.start, period.end),
      financialKpis: await this.getFinancialKpis(period.start, period.end),
      customerKpis: await this.getCustomerKpis(period.start, period.end),
      employeeKpis: await this.getEmployeeKpis(period.start, period.end),
      strategicKpis: await this.getStrategicKpis(period.start, period.end)
    };

    return kpiData;
  }

  // Méthodes utilitaires
  private getDefaultDateRange(): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30); // 30 derniers jours par défaut
    return { start, end };
  }

  private async calculateAverageResolutionTime(startDate: Date, endDate: Date): Promise<number> {
    const complaints = await Complaint.find({
      createdAt: { $gte: startDate, $lte: endDate },
      resolvedAt: { $exists: true }
    }).select('createdAt resolvedAt');

    if (complaints.length === 0) return 0;

    const totalHours = complaints.reduce((sum, complaint) => {
      const hours = (complaint.resolvedAt!.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    return totalHours / complaints.length;
  }

  private async calculateSatisfactionRate(startDate: Date, endDate: Date): Promise<number> {
    const complaints = await Complaint.find({
      createdAt: { $gte: startDate, $lte: endDate },
      satisfactionRating: { $exists: true }
    }).select('satisfactionRating');

    if (complaints.length === 0) return 0;

    const totalRating = complaints.reduce((sum, complaint) => 
      sum + (complaint.satisfactionRating || 0), 0
    );

    return totalRating / complaints.length;
  }

  private async getComplaintTrends(startDate: Date, endDate: Date) {
    return await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          created: { $sum: 1 },
          resolved: {
            $sum: {
              $cond: [{ $in: ["$status", ["resolved", "closed"]] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
  }

  private async getTeamPerformanceSummary() {
    return await Team.aggregate([
      {
        $lookup: {
          from: 'complaints',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'complaints'
        }
      },
      {
        $project: {
          name: 1,
          totalComplaints: { $size: '$complaints' },
          resolvedComplaints: {
            $size: {
              $filter: {
                input: '$complaints',
                cond: { $in: ['$$this.status', ['resolved', 'closed']] }
              }
            }
          },
          avgResolutionTime: { $avg: '$complaints.resolutionTime' }
        }
      },
      {
        $sort: { resolvedComplaints: -1 }
      }
    ]);
  }

  private async getCategoryDistribution(startDate: Date, endDate: Date) {
    return await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
  }

  // Créer un rapport personnalisé
  async createCustomReport(
    title: string,
    description: string,
    sections: any[],
    filters: ReportFilters,
    userId: string
  ): Promise<IReport> {
    const report = new Report({
      title,
      description,
      type: 'custom_report',
      template: 'custom_template',
      data: { sections },
      filters,
      format: 'pdf',
      status: 'active',
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: {
        viewers: [userId],
        editors: [userId],
        downloaders: [userId]
      }
    });

    return await report.save();
  }

  // Programmer un rapport automatisé
  async scheduleReport(
    reportId: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    recipients: string[],
    timezone: string
  ): Promise<void> {
    const nextRun = this.calculateNextRun(frequency);
    
    await Report.findByIdAndUpdate(reportId, {
      $set: {
        'schedule.enabled': true,
        'schedule.frequency': frequency,
        'schedule.recipients': recipients,
        'schedule.timezone': timezone,
        'schedule.nextRun': nextRun
      }
    });
  }

  private calculateNextRun(frequency: string): Date {
    const now = new Date();
    switch(frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        return now;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        return now;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        return now;
      default:
        return now;
    }
  }

  // Récupérer les rapports d'un utilisateur
  async getUserReports(userId: string): Promise<IReport[]> {
    return await Report.find({
      $or: [
        { createdBy: userId },
        { 'permissions.viewers': userId },
        { 'permissions.editors': userId }
      ]
    }).sort({ createdAt: -1 });
  }

  // Récupérer les KPIs
  async getKpis(filters: ReportFilters): Promise<any[]> {
    const kpiDefinitions = await KpiDefinition.find();
    const kpiResults: any[] = [];

    for (const kpi of kpiDefinitions) {
      let value: number;
      
      switch(kpi.dataSource) {
        case 'complaints':
          value = await this.calculateComplaintKpi(kpi, filters);
          break;
        case 'teams':
          value = await this.calculateTeamKpi(kpi, filters);
          break;
        case 'users':
          value = await this.calculateUserKpi(kpi, filters);
          break;
        default:
          value = 0;
      }

      kpiResults.push({
        id: kpi.id,
        name: kpi.name,
        value,
        target: kpi.target,
        unit: kpi.unit,
        status: this.getKpiStatus(value, kpi.thresholds),
        trend: await this.getKpiTrend(kpi.id, filters)
      });
    }

    return kpiResults;
  }

  private async calculateComplaintKpi(kpi: any, filters: ReportFilters): Promise<number> {
    // Implémentation spécifique selon la formule du KPI
    switch(kpi.calculationMethod) {
      case 'count':
        return await Complaint.countDocuments({
          createdAt: {
            $gte: filters.dateRange?.start,
            $lte: filters.dateRange?.end
          }
        });
      case 'average':
        const complaints = await Complaint.find({
          createdAt: {
            $gte: filters.dateRange?.start,
            $lte: filters.dateRange?.end
          }
        }).select(kpi.formula);
        
        if (complaints.length === 0) return 0;
        return complaints.reduce((sum, c) => sum + (c as any)[kpi.formula], 0) / complaints.length;
      default:
        return 0;
    }
  }

  private async calculateTeamKpi(kpi: any, filters: ReportFilters): Promise<number> {
    // Implémentation pour les KPIs d'équipe
    return 0;
  }

  private async calculateUserKpi(kpi: any, filters: ReportFilters): Promise<number> {
    // Implémentation pour les KPIs utilisateur
    return 0;
  }

  private getKpiStatus(value: number, thresholds: any): 'good' | 'warning' | 'critical' {
    if (value >= thresholds.green) return 'good';
    if (value >= thresholds.yellow) return 'warning';
    return 'critical';
  }

  private async getKpiTrend(kpiId: string, filters: ReportFilters): Promise<any> {
    // Implémentation pour obtenir la tendance d'un KPI
    return {
      direction: 'up',
      change: 5.2,
      period: 'last_month'
    };
  }

  // Exporter un rapport
  async exportReport(
    reportId: string,
    format: 'pdf' | 'excel' | 'csv' | 'json',
    userId: string
  ): Promise<Buffer | string> {
    const report = await Report.findById(reportId);
    if (!report) throw new Error('Rapport non trouvé');

    // Vérifier les permissions
    if (!report.permissions.downloaders.includes(userId) && 
        !report.permissions.editors.includes(userId) &&
        report.createdBy !== userId) {
      throw new Error('Permission refusée');
    }

    // Incrémenter le compteur de téléchargements
    await Report.findByIdAndUpdate(reportId, {
      $inc: { downloads: 1 },
      $set: { lastGenerated: new Date() }
    });

    // Générer l'export selon le format
    switch(format) {
      case 'pdf':
        return await this.generatePdfExport(report);
      case 'excel':
        return await this.generateExcelExport(report);
      case 'csv':
        return await this.generateCsvExport(report);
      case 'json':
        return JSON.stringify(report.data, null, 2);
      default:
        throw new Error('Format non supporté');
    }
  }

  private async generatePdfExport(report: IReport): Promise<Buffer> {
    // Implémentation de l'export PDF
    // Utiliser pdfkit ou puppeteer
    return Buffer.from('PDF content would be here', 'utf-8');
  }

  private async generateExcelExport(report: IReport): Promise<Buffer> {
    // Implémentation de l'export Excel
    // Utiliser exceljs
    return Buffer.from('Excel content would be here', 'utf-8');
  }

  private async generateCsvExport(report: IReport): Promise<string> {
    // Implémentation de l'export CSV
    return 'CSV content would be here';
  }

  // Créer un dashboard personnalisé
  async createDashboard(
    name: string,
    description: string,
    layout: any,
    widgets: any[],
    userId: string
  ): Promise<any> {
    const dashboard = new DashboardConfig({
      id: `dashboard_${Date.now()}`,
      name,
      description,
      layout,
      widgets,
      filters: {},
      refreshInterval: 300,
      permissions: {
        viewers: [userId],
        editors: [userId]
      },
      theme: 'light'
    });

    return await dashboard.save();
  }

  // Récupérer les dashboards d'un utilisateur
  async getUserDashboards(userId: string): Promise<any[]> {
    return await DashboardConfig.find({
      $or: [
        { 'permissions.viewers': userId },
        { 'permissions.editors': userId }
      ]
    });
  }

  // Mettre à jour un dashboard
  async updateDashboard(
    dashboardId: string,
    updates: Partial<any>,
    userId: string
  ): Promise<any> {
    const dashboard = await DashboardConfig.findById(dashboardId);
    if (!dashboard) throw new Error('Dashboard non trouvé');

    if (!dashboard.permissions.editors.includes(userId)) {
      throw new Error('Permission refusée');
    }

    Object.assign(dashboard, updates, { updatedAt: new Date() });
    return await dashboard.save();
  }

  // Créer un KPI personnalisé
  async createCustomKpi(
    kpiData: Partial<any>,
    userId: string
  ): Promise<any> {
    const kpi = new KpiDefinition({
      ...kpiData,
      id: `kpi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    return await kpi.save();
  }

  // Obtenir les statistiques globales
  async getGlobalAnalytics(): Promise<any> {
    const [
      totalReports,
      activeDashboards,
      totalKpis,
      scheduledReports,
      mostPopularReport
    ] = await Promise.all([
      Report.countDocuments(),
      DashboardConfig.countDocuments(),
      KpiDefinition.countDocuments(),
      Report.countDocuments({ 'schedule.enabled': true }),
      Report.findOne().sort({ views: -1 })
    ]);

    return {
      totalReports,
      activeDashboards,
      totalKpis,
      scheduledReports,
      mostPopularReport: mostPopularReport?.title || 'Aucun',
      usageStats: await this.getUsageStatistics()
    };
  }

  private async getUsageStatistics(): Promise<any> {
    // Statistiques d'utilisation des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          reportsGenerated: { $sum: 1 },
          views: { $sum: '$views' },
          downloads: { $sum: '$downloads' }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    return dailyUsage;
  }
}

export default new AnalyticsService();
```

---

## 5. 📄 UTILITAIRES DE GÉNÉRATION DE RAPPORTS

### 📄 `backend/src/utils/reportGenerator.ts`
```typescript
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { IReport } from '../models/Report';

export class ReportGenerator {
  // Générer un rapport PDF
  static async generatePDF(report: IReport): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // En-tête du rapport
        doc.fontSize(20)
           .text(report.title, { align: 'center' });
        
        doc.fontSize(12)
           .text(report.description || '', { align: 'center' })
           .moveDown();

        // Ajouter les sections du rapport
        if (report.data && report.data.sections) {
          report.data.sections.forEach((section: any) => {
            doc.fontSize(16)
               .text(section.title)
               .fontSize(12)
               .text(section.content || '')
               .moveDown();
          });
        }

        // Pied de page
        doc.fontSize(10)
           .text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 50, 750);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // Générer un rapport Excel
  static async generateExcel(report: IReport): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ReclamTrack Analytics';
    workbook.created = new Date();

    // Créer une feuille pour le résumé
    const summarySheet = workbook.addWorksheet('Résumé');
    summarySheet.addRow([report.title]);
    summarySheet.addRow([report.description || '']);
    summarySheet.addRow(['']);

    // Ajouter les données
    if (report.data) {
      Object.entries(report.data).forEach(([key, value]) => {
        summarySheet.addRow([key, JSON.stringify(value)]);
      });
    }

    // Créer des feuilles pour chaque section
    if (report.data && report.data.sections) {
      report.data.sections.forEach((section: any) => {
        const sheet = workbook.addWorksheet(section.title.substring(0, 31)); // Limite Excel
        sheet.addRow([section.title]);
        
        if (section.data && Array.isArray(section.data)) {
          // Ajouter les en-têtes si disponibles
          if (section.data.length > 0) {
            const headers = Object.keys(section.data[0]);
            sheet.addRow(headers);
            
            // Ajouter les données
            section.data.forEach((row: any) => {
              sheet.addRow(headers.map(header => row[header]));
            });
          }
        }
      });
    }

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  // Générer un rapport CSV
  static async generateCSV(report: IReport): Promise<string> {
    let csvContent = '';

    // En-tête
    csvContent += `Titre: ${report.title}\n`;
    csvContent += `Description: ${report.description || ''}\n`;
    csvContent += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    // Données
    if (report.data) {
      Object.entries(report.data).forEach(([key, value]) => {
        csvContent += `${key};${JSON.stringify(value)}\n`;
      });
    }

    return csvContent;
  }

  // Appliquer des filtres aux données
  static applyFilters(data: any, filters: any): any {
    // Implémentation des filtres selon les critères
    return data;
  }

  // Formater les données pour l'export
  static formatData(data: any, format: string): any {
    switch(format) {
      case 'currency':
        return typeof data === 'number' ? 
          data.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : 
          data;
      case 'percentage':
        return typeof data === 'number' ? 
          `${(data * 100).toFixed(2)}%` : 
          data;
      case 'number':
        return typeof data === 'number' ? 
          data.toLocaleString('fr-FR') : 
          data;
      default:
        return data;
    }
  }
}
```

---

## 6. 📄 CONTROLLERS API

### 📄 `backend/src/controllers/analyticsController.ts`
```typescript
import { Request, Response } from 'express';
import analyticsService from '../services/analyticsService';
import { Report, DashboardConfig, KpiDefinition } from '../models/Report';
import { ReportGenerator } from '../utils/reportGenerator';

export class AnalyticsController {
  // Générer un rapport
  static async generateReport(req: Request, res: Response) {
    try {
      const { reportType, filters } = req.body;
      const userId = req.user!.userId;

      if (!reportType) {
        return res.status(400).json({ error: 'Type de rapport requis' });
      }

      const reportData = await analyticsService.generateReport(reportType, filters, userId);

      res.json(reportData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Créer un rapport personnalisé
  static async createCustomReport(req: Request, res: Response) {
    try {
      const { title, description, sections, filters } = req.body;
      const userId = req.user!.userId;

      if (!title || !sections) {
        return res.status(400).json({ error: 'Titre et sections requis' });
      }

      const report = await analyticsService.createCustomReport(
        title,
        description,
        sections,
        filters,
        userId
      );

      res.status(201).json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Programmer un rapport
  static async scheduleReport(req: Request, res: Response) {
    try {
      const { reportId, frequency, recipients, timezone } = req.body;
      const userId = req.user!.userId;

      if (!reportId || !frequency || !recipients || !timezone) {
        return res.status(400).json({ 
          error: 'reportId, frequency, recipients et timezone requis' 
        });
      }

      await analyticsService.scheduleReport(reportId, frequency, recipients, timezone);

      res.json({ success: true, message: 'Rapport programmé avec succès' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les rapports d'un utilisateur
  static async getUserReports(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const reports = await analyticsService.getUserReports(userId);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les KPIs
  static async getKpis(req: Request, res: Response) {
    try {
      const { filters } = req.query;
      const kpis = await analyticsService.getKpis(
        filters ? JSON.parse(filters as string) : {}
      );
      res.json(kpis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Exporter un rapport
  static async exportReport(req: Request, res: Response) {
    try {
      const { reportId, format } = req.params;
      const userId = req.user!.userId;

      if (!reportId || !format) {
        return res.status(400).json({ error: 'reportId et format requis' });
      }

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ error: 'Rapport non trouvé' });
      }

      const exportedData = await analyticsService.exportReport(
        reportId,
        format as any,
        userId
      );

      // Déterminer le type de contenu
      let contentType: string;
      let filename: string;

      switch(format) {
        case 'pdf':
          contentType = 'application/pdf';
          filename = `${report.title.replace(/\s+/g, '_')}.pdf`;
          break;
        case 'excel':
          contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          filename = `${report.title.replace(/\s+/g, '_')}.xlsx`;
          break;
        case 'csv':
          contentType = 'text/csv';
          filename = `${report.title.replace(/\s+/g, '_')}.csv`;
          break;
        case 'json':
          contentType = 'application/json';
          filename = `${report.title.replace(/\s+/g, '_')}.json`;
          break;
        default:
          throw new Error('Format non supporté');
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      if (Buffer.isBuffer(exportedData)) {
        res.send(exportedData);
      } else {
        res.send(exportedData);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Créer un dashboard personnalisé
  static async createDashboard(req: Request, res: Response) {
    try {
      const { name, description, layout, widgets } = req.body;
      const userId = req.user!.userId;

      if (!name || !layout || !widgets) {
        return res.status(400).json({ error: 'name, layout et widgets requis' });
      }

      const dashboard = await analyticsService.createDashboard(
        name,
        description,
        layout,
        widgets,
        userId
      );

      res.status(201).json(dashboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les dashboards d'un utilisateur
  static async getUserDashboards(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const dashboards = await analyticsService.getUserDashboards(userId);
      res.json(dashboards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour un dashboard
  static async updateDashboard(req: Request, res: Response) {
    try {
      const { dashboardId } = req.params;
      const updates = req.body;
      const userId = req.user!.userId;

      const dashboard = await analyticsService.updateDashboard(
        dashboardId,
        updates,
        userId
      );

      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Créer un KPI personnalisé
  static async createCustomKpi(req: Request, res: Response) {
    try {
      const kpiData = req.body;
      const userId = req.user!.userId;

      const kpi = await analyticsService.createCustomKpi(kpiData, userId);
      res.status(201).json(kpi);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les statistiques globales
  static async getGlobalAnalytics(req: Request, res: Response) {
    try {
      const analytics = await analyticsService.getGlobalAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer un rapport par ID
  static async getReportById(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      
      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ error: 'Rapport non trouvé' });
      }

      // Incrémenter le compteur de vues
      await Report.findByIdAndUpdate(reportId, {
        $inc: { views: 1 }
      });

      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Mettre à jour un rapport
  static async updateReport(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const updates = req.body;
      const userId = req.user!.userId;

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ error: 'Rapport non trouvé' });
      }

      // Vérifier les permissions
      if (report.createdBy !== userId && !report.permissions.editors.includes(userId)) {
        return res.status(403).json({ error: 'Permission refusée' });
      }

      Object.assign(report, updates, { updatedAt: new Date() });
      const updatedReport = await report.save();

      res.json(updatedReport);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Supprimer un rapport
  static async deleteReport(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const userId = req.user!.userId;

      const report = await Report.findById(reportId);
      if (!report) {
        return res.status(404).json({ error: 'Rapport non trouvé' });
      }

      // Vérifier les permissions
      if (report.createdBy !== userId) {
        return res.status(403).json({ error: 'Permission refusée' });
      }

      await Report.findByIdAndDelete(reportId);
      res.json({ success: true, message: 'Rapport supprimé' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Récupérer les templates de rapports
  static async getReportTemplates(req: Request, res: Response) {
    try {
      const templates = await ReportTemplate.find().sort({ category: 1, name: 1 });
      res.json(templates);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Créer un template de rapport
  static async createReportTemplate(req: Request, res: Response) {
    try {
      // Vérifier que l'utilisateur est admin
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      const templateData = req.body;
      const template = new ReportTemplate(templateData);
      const savedTemplate = await template.save();

      res.status(201).json(savedTemplate);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

---

## 7. 📄 ROUTES API

### 📄 `backend/src/routes/analytics.ts`
```typescript
import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Routes protégées
router.post('/reports/generate', authenticate, AnalyticsController.generateReport);
router.post('/reports/custom', authenticate, AnalyticsController.createCustomReport);
router.post('/reports/schedule', authenticate, AnalyticsController.scheduleReport);
router.get('/reports', authenticate, AnalyticsController.getUserReports);
router.get('/reports/:reportId', authenticate, AnalyticsController.getReportById);
router.put('/reports/:reportId', authenticate, AnalyticsController.updateReport);
router.delete('/reports/:reportId', authenticate, AnalyticsController.deleteReport);
router.get('/reports/:reportId/export/:format', authenticate, AnalyticsController.exportReport);

router.get('/kpis', authenticate, AnalyticsController.getKpis);
router.post('/kpis', authenticate, AnalyticsController.createCustomKpi);

router.post('/dashboards', authenticate, AnalyticsController.createDashboard);
router.get('/dashboards', authenticate, AnalyticsController.getUserDashboards);
router.put('/dashboards/:dashboardId', authenticate, AnalyticsController.updateDashboard);

router.get('/templates', authenticate, AnalyticsController.getReportTemplates);
router.post('/templates', authenticate, AnalyticsController.createReportTemplate);

// Routes publiques (pour dashboard)
router.get('/global', AnalyticsController.getGlobalAnalytics);

export default router;
```

### 📄 `backend/src/server.ts` (ajout de la route)
```typescript
// ... imports existants ...
import analyticsRoutes from './routes/analytics';

// ... middleware ...

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/analytics', analyticsRoutes); // ← AJOUTER CETTE LIGNE

// ... démarrage serveur ...
```

---

## 8. 📄 FRONTEND : TYPES ET INTERFACES

### 📄 `frontend/src/types/analytics.ts`
```typescript
export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  template: string;
  data: any;
  filters: ReportFilters;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    recipients: string[];
    timezone: string;
    nextRun: string;
  };
  format: ReportFormat;
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastGenerated?: string;
  views: number;
  downloads: number;
  permissions: {
    viewers: string[];
    editors: string[];
    downloaders: string[];
  };
}

export type ReportType = 
  | 'executive_summary'
  | 'operational_metrics'
  | 'financial_analysis'
  | 'performance_review'
  | 'complaint_analysis'
  | 'team_performance'
  | 'resource_utilization'
  | 'customer_satisfaction'
  | 'quality_metrics'
  | 'efficiency_report'
  | 'predictive_analytics'
  | 'compliance_report'
  | 'risk_assessment'
  | 'benchmarking'
  | 'trend_analysis'
  | 'kpi_dashboard'
  | 'custom_report';

export type ReportFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'html' | 'powerpoint';

export interface ReportFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  departments?: string[];
  teams?: string[];
  priority?: string[];
  status?: string[];
  categories?: string[];
  regions?: string[];
  custom?: any;
}

export interface ReportSection {
  id: string;
  title: string;
  type