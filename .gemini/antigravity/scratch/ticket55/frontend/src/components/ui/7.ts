7
Parfait ! Je vais continuer avec les **étapes avancées** du système de reporting et analytics. Voici la suite complète :

---

# 📊 SUITE DU SYSTÈME DE REPORTING ET ANALYTICS AVANCÉS

## 9. 📄 HOOKS FRONTEND

### 📄 `frontend/src/hooks/useAnalytics.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Report, ReportFilters, KpiDefinition, DashboardConfig } from '@/types/analytics';

export const useAnalytics = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [kpis, setKpis] = useState<KpiDefinition[]>([]);
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les rapports de l'utilisateur
  const fetchUserReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/analytics/reports');
      setReports(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement rapports');
    } finally {
      setLoading(false);
    }
  }, []);

  // Générer un rapport
  const generateReport = async (reportType: string, filters: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/analytics/reports/generate', {
        reportType,
        filters
      });
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur génération rapport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Créer un rapport personnalisé
  const createCustomReport = async (reportData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/analytics/reports/custom', reportData);
      setReports(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur création rapport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Exporter un rapport
  const exportReport = async (reportId: string, format: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/analytics/reports/${reportId}/export/${format}`, {
        responseType: 'blob'
      });
      
      // Télécharger le fichier
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur export rapport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les KPIs
  const fetchKpis = useCallback(async (filters?: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = filters ? { filters: JSON.stringify(filters) } : {};
      const response = await api.get('/analytics/kpis', { params });
      setKpis(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement KPIs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un KPI personnalisé
  const createCustomKpi = async (kpiData: Partial<KpiDefinition>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/analytics/kpis', kpiData);
      setKpis(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur création KPI');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les dashboards
  const fetchDashboards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/analytics/dashboards');
      setDashboards(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement dashboards');
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un dashboard
  const createDashboard = async (dashboardData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/analytics/dashboards', dashboardData);
      setDashboards(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur création dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un dashboard
  const updateDashboard = async (dashboardId: string, updates: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/analytics/dashboards/${dashboardId}`, updates);
      setDashboards(prev => 
        prev.map(dashboard => 
          dashboard.id === dashboardId ? response.data : dashboard
        )
      );
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur mise à jour dashboard');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer un rapport par ID
  const fetchReportById = async (reportId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/analytics/reports/${reportId}`);
      setCurrentReport(response.data);
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur chargement rapport');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Effet initial
  useEffect(() => {
    fetchUserReports();
    fetchDashboards();
  }, [fetchUserReports, fetchDashboards]);

  return {
    reports,
    kpis,
    dashboards,
    currentReport,
    loading,
    error,
    fetchUserReports,
    generateReport,
    createCustomReport,
    exportReport,
    fetchKpis,
    createCustomKpi,
    fetchDashboards,
    createDashboard,
    updateDashboard,
    fetchReportById,
    setCurrentReport
  };
};
```

---

## 10. 📄 COMPOSANTS UI AVANCÉS

### 📄 `frontend/src/components/analytics/Dashboard.tsx`
```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KpiCard } from './KpiCard';
import { ChartWidget } from './ChartWidget';
import { FilterPanel } from './FilterPanel';
import { ExportButton } from './ExportButton';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download, 
  Settings,
  RefreshCw,
  Calendar,
  Filter
} from 'lucide-react';

interface DashboardProps {
  dashboardId?: string;
  className?: string;
}

export const Dashboard = ({ dashboardId, className = '' }: DashboardProps) => {
  const { 
    kpis, 
    dashboards, 
    loading, 
    error, 
    fetchKpis, 
    fetchDashboards 
  } = useAnalytics();
  
  const [selectedDashboard, setSelectedDashboard] = useState<any>(null);
  const [filters, setFilters] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);

  // Charger le dashboard sélectionné
  useEffect(() => {
    if (dashboardId) {
      const dashboard = dashboards.find(d => d.id === dashboardId);
      setSelectedDashboard(dashboard);
    } else if (dashboards.length > 0) {
      setSelectedDashboard(dashboards[0]);
    }
  }, [dashboardId, dashboards]);

  // Charger les KPIs avec les filtres
  useEffect(() => {
    fetchKpis(filters);
  }, [filters, fetchKpis]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchKpis(filters);
      await fetchDashboards();
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Erreur: {error}
      </div>
    );
  }

  const dashboardWidgets = selectedDashboard?.widgets || [];

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedDashboard?.name || 'Dashboard Analytics'}
            </h1>
            {selectedDashboard?.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {selectedDashboard.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <FilterPanel 
              onFiltersChange={setFilters}
              currentFilters={filters}
            />
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Rafraîchir
            </button>
            
            <ExportButton 
              data={kpis}
              fileName="dashboard-export"
              formats={['pdf', 'excel', 'csv']}
            />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto p-4">
        {loading && !kpis.length ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.slice(0, 4).map((kpi, index) => (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <KpiCard kpi={kpi} />
                </motion.div>
              ))}
            </div>

            {/* Widgets personnalisés */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardWidgets.map((widget: any, index: number) => {
                switch(widget.type) {
                  case 'chart':
                    return (
                      <motion.div
                        key={widget.id}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ChartWidget 
                          title={widget.title}
                          type={widget.visualization.type}
                          data={widget.data}
                          options={widget.visualization.options}
                        />
                      </motion.div>
                    );
                  case 'kpi':
                    return (
                      <motion.div
                        key={widget.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <KpiCard kpi={widget.kpiData} />
                      </motion.div>
                    );
                  default:
                    return null;
                }
              })}
            </div>

            {/* Charts supplémentaires si aucun widget personnalisé */}
            {dashboardWidgets.length === 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartWidget 
                  title="Tendance des Réclamations"
                  type="line"
                  data={[
                    { name: 'Jan', value: 400 },
                    { name: 'Fév', value: 300 },
                    { name: 'Mar', value: 200 },
                    { name: 'Avr', value: 278 },
                    { name: 'Mai', value: 189 }
                  ]}
                />
                
                <ChartWidget 
                  title="Distribution par Catégorie"
                  type="pie"
                  data={[
                    { name: 'Eau', value: 400 },
                    { name: 'Électricité', value: 300 },
                    { name: 'Routes', value: 300 },
                    { name: 'Autre', value: 200 }
                  ]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 📄 `frontend/src/components/analytics/KpiCard.tsx`
```tsx
'use client';

import React from 'react';
import { KpiDefinition } from '@/types/analytics';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface KpiCardProps {
  kpi: KpiDefinition;
  className?: string;
}

export const KpiCard = ({ kpi, className = '' }: KpiCardProps) => {
  const getStatusColor = () => {
    switch(kpi.status) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTrendIcon = () => {
    if (!kpi.trend) return <Minus className="w-4 h-4" />;
    
    switch(kpi.trend.direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === 'currency') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    }
    return value.toLocaleString('fr-FR');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 dark:text-white text-sm">
          {kpi.name}
        </h3>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {kpi.status === 'good' ? 'Bon' : kpi.status === 'warning' ? 'Attention' : 'Critique'}
        </span>
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatValue(kpi.value, kpi.unit)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Objectif: {formatValue(kpi.target, kpi.unit)}
        </div>
      </div>
      
      {kpi.trend && (
        <div className="flex items-center text-sm">
          {getTrendIcon()}
          <span className="ml-1">
            {kpi.trend.change > 0 ? '+' : ''}{kpi.trend.change}% {kpi.trend.period}
          </span>
        </div>
      )}
      
      {kpi.description && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {kpi.description}
        </p>
      )}
      
      {/* Barre de progression vers l'objectif */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ 
              width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` 
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>0</span>
          <span>{formatValue(kpi.target, kpi.unit)}</span>
        </div>
      </div>
    </motion.div>
  );
};
```

### 📄 `frontend/src/components/analytics/ChartWidget.tsx`
```tsx
'use client';

import React from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as PieRechart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ChartWidgetProps {
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: any[];
  options?: any;
  className?: string;
}

export const ChartWidget = ({ 
  title, 
  type, 
  data, 
  options = {},
  className = '' 
}: ChartWidgetProps) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderChart = () => {
    switch(type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieRechart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieRechart>
        );
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
```

### 📄 `frontend/src/components/analytics/FilterPanel.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import { ReportFilters } from '@/types/analytics';
import { 
  Calendar, 
  Filter, 
  X, 
  ChevronDown 
} from 'lucide-react';

interface FilterPanelProps {
  onFiltersChange: (filters: ReportFilters) => void;
  currentFilters: ReportFilters;
  className?: string;
}

export const FilterPanel = ({ 
  onFiltersChange, 
  currentFilters,
  className = '' 
}: FilterPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<ReportFilters>(currentFilters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const handleDateChange = (field: 'start' | 'end', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtres
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Filtres
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filtre de date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Période
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Du
                  </label>
                  <input
                    type="date"
                    value={localFilters.dateRange?.start || ''}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Au
                  </label>
                  <input
                    type="date"
                    value={localFilters.dateRange?.end || ''}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Filtres supplémentaires */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Départements
                </label>
                <select 
                  multiple
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="water">Eau</option>
                  <option value="electricity">Électricité</option>
                  <option value="roads">Routes</option>
                  <option value="sanitation">Assainissement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priorité
                </label>
                <div className="space-y-2">
                  {['low', 'medium', 'high', 'urgent'].map(priority => (
                    <label key={priority} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-2 mt-6">
              <button
                onClick={handleResetFilters}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 📄 `frontend/src/components/analytics/ExportButton.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, FileCsv } from 'lucide-react';
import { saveAs } from 'file-saver';

interface ExportButtonProps {
  data: any;
  fileName: string;
  formats: ('pdf' | 'excel' | 'csv' | 'json')[];
  className?: string;
}

export const ExportButton = ({ 
  data, 
  fileName, 
  formats,
  className = '' 
}: ExportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format: string) => {
    setExporting(true);
    try {
      let blob: Blob;
      let extension: string;

      switch(format) {
        case 'pdf':
          // Générer PDF (simulation)
          blob = new Blob(['PDF content'], { type: 'application/pdf' });
          extension = 'pdf';
          break;
        case 'excel':
          // Générer Excel (simulation)
          blob = new Blob(['Excel content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          extension = 'xlsx';
          break;
        case 'csv':
          // Générer CSV
          const csvContent = convertToCSV(data);
          blob = new Blob([csvContent], { type: 'text/csv' });
          extension = 'csv';
          break;
        case 'json':
          // Générer JSON
          const jsonContent = JSON.stringify(data, null, 2);
          blob = new Blob([jsonContent], { type: 'application/json' });
          extension = 'json';
          break;
        default:
          throw new Error('Format non supporté');
      }

      saveAs(blob, `${fileName}.${extension}`);
    } catch (error) {
      console.error('Erreur export:', error);
    } finally {
      setExporting(false);
      setIsOpen(false);
    }
  };

  const convertToCSV = (objArray: any[]): string => {
    if (!objArray || objArray.length === 0) return '';

    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    // En-têtes
    const headers = Object.keys(array[0]);
    str += headers.join(';') + '\n';

    // Données
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headers) {
        if (line !== '') line += ';';
        line += array[i][headers[index]];
      }
      str += line + '\n';
    }

    return str;
  };

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'excel': return <FileSpreadsheet className="w-4 h-4" />;
      case 'csv': return <FileCsv className="w-4 h-4" />;
      case 'json': return <FileText className="w-4 h-4" />;
      default: return <Download className="w-4 h-4" />;
    }
  };

  const getFormatLabel = (format: string) => {
    switch(format) {
      case 'pdf': return 'PDF';
      case 'excel': return 'Excel';
      case 'csv': return 'CSV';
      case 'json': return 'JSON';
      default: return format.toUpperCase();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={exporting}
        className="flex items-center px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
      >
        <Download className="w-4 h-4 mr-2" />
        {exporting ? 'Export en cours...' : 'Exporter'}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="py-1">
            {formats.map(format => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {getFormatIcon(format)}
                <span className="ml-2">{getFormatLabel(format)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 11. 📄 PAGE PRINCIPALE ANALYTICS

### 📄 `frontend/src/app/(app)/analytics/page.tsx`
```tsx
'use client';

import React, { useState } from 'react';
import { Dashboard } from '@/components/analytics/Dashboard';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  FileText,
  Plus,
  Settings,
  Calendar
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'reports', label: 'Rapports', icon: FileText },
    { id: 'kpis', label: 'KPIs', icon: TrendingUp },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <ResponsiveLayout pageTitle="Analytics">
      <div className="h-full flex flex-col">
        {/* Navigation tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex space-x-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700'