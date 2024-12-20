"use client"

import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Toast, useToast } from "@/components/ui/toast";
import { Login } from './login';
import { LogEntry } from './types';
import { logService } from '../../app/services/logService';

// Log seviye badge bileşeni
type LogLevel = 'Information' | 'Error' | 'Critical' | 'Warning';

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
    const styles: Record<LogLevel, string> = {
        Error: 'bg-red-100 text-red-800',
        Information: 'bg-green-100 text-green-800',
        Critical: 'bg-purple-100 text-purple-800',
        Warning: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs ${styles[level] || 'bg-gray-100 text-gray-800'}`}>
            {level}
        </span>
    );
};

// Log detay bileşeni
const LogDetail = ({ log }: { log: LogEntry }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Tarih</p>
                <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Seviye</p>
                <LogLevelBadge level={log.logLevel} />
            </div>
            <div className="space-y-2 col-span-2">
                <p className="text-sm font-medium text-gray-500">Kaynak</p>
                <p className="text-sm">{log.source}</p>
            </div>
            <div className="space-y-2 col-span-2">
                <p className="text-sm font-medium text-gray-500">Mesaj</p>
                <p className="text-sm bg-gray-50 p-3 rounded">{log.message}</p>
            </div>
            {log.exception && (
                <div className="space-y-2 col-span-2">
                    <p className="text-sm font-medium text-gray-500">İstisna</p>
                    <pre className="text-sm bg-red-50 p-3 rounded overflow-auto">{log.exception}</pre>
                </div>
            )}
            {log.stackTrace && (
                <div className="space-y-2 col-span-2">
                    <p className="text-sm font-medium text-gray-500">Stack Trace</p>
                    <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto whitespace-pre-wrap">{log.stackTrace}</pre>
                </div>
            )}
        </div>
    </div>
);

const LogMonitoring = () => {
    // State tanımlamaları
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [logLevel, setLogLevel] = useState('all');
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const { toast, showToast, hideToast } = useToast();
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 100,
        totalPages: 1,
        totalCount: 0
    });

    // Logları getir
    const fetchLogs = async () => {
        try {
          setLoading(true);
          const response = await logService.getLogs({
            level: logLevel === 'all' ? undefined : logLevel,
            search: searchTerm || undefined,
            page: pagination.currentPage,
            pageSize: pagination.pageSize
          });
          setLogs(response.data);
          setPagination(response.pagination);
          setLoading(false);
        } catch (_) { // error yerine _ kullanarak unused variable hatasını gideriyoruz
          showToast('Loglar yüklenirken bir hata oluştu.', 'error');
          setLoading(false);
        }
      };

  // logları temizleme fonksiyonunu düzeltme
const handleClearLogs = async () => {
    if (deletePassword !== 'Gama123!') {
      showToast('Hatalı şifre!', 'error');
      return;
    }
  
    try {
      const result = await logService.clearLogs({
        level: logLevel !== 'all' ? logLevel : undefined
      });
      showToast(`${result.deletedCount} log kaydı silindi.`, 'success');
      setIsDeleteModalOpen(false);
      setDeletePassword('');
      fetchLogs();
    } catch (_) { // error yerine _ kullanarak unused variable hatasını gideriyoruz
      showToast('Loglar silinirken bir hata oluştu.', 'error');
    }
  };
    // Log değişikliklerini izle
    useEffect(() => {
        if (isLoggedIn) {
          fetchLogs();
        }
      }, [isLoggedIn, logLevel, searchTerm, pagination.currentPage, fetchLogs]); // fetchLogs'u dependency array'e ekledik

    if (!isLoggedIn) {
        return <Login onLogin={setIsLoggedIn} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Log İzleme Paneli</CardTitle>
                        <Button onClick={() => setIsLoggedIn(false)} variant="outline">
                            Çıkış Yap
                        </Button>
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <Input
                            placeholder="Ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Select value={logLevel} onValueChange={setLogLevel}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Log Seviyesi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tümü</SelectItem>
                                <SelectItem value="Error">Error</SelectItem>
                                <SelectItem value="Information">Information</SelectItem>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="Warning">Warning</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Logları Temizle
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">Yükleniyor...</p>
                        </div>
                    ) : (
                        <>
                            <div className="relative overflow-x-auto rounded-lg border">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Tarih</th>
                                            <th className="px-6 py-3">Seviye</th>
                                            <th className="px-6 py-3">Mesaj</th>
                                            <th className="px-6 py-3">Kaynak</th>
                                            <th className="px-6 py-3">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {logs.map(log => (
                                            <tr key={log.id} className="bg-white hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <LogLevelBadge level={log.logLevel} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="truncate max-w-md" title={log.message}>
                                                        {log.message}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">{log.source}</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setSelectedLog(log)}
                                                        className="text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        Detay
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Toplam: {pagination.totalCount} kayıt
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                        disabled={pagination.currentPage === 1}
                                        variant="outline"
                                    >
                                        Önceki
                                    </Button>
                                    <span className="px-4 py-2">
                                        Sayfa {pagination.currentPage} / {pagination.totalPages}
                                    </span>
                                    <Button
                                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        variant="outline"
                                    >
                                        Sonraki
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Log Detay Modal */}
            <Modal
                isOpen={!!selectedLog}
                onClose={() => setSelectedLog(null)}
                title="Log Detayı"
            >
                {selectedLog && <LogDetail log={selectedLog} />}
            </Modal>

            {/* Log Silme Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletePassword('');
                }}
                title="Logları Temizle"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Log kayıtlarını silmek için lütfen şifrenizi girin.
                    </p>
                    <Input
                        type="password"
                        placeholder="Şifre"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setDeletePassword('');
                            }}
                        >
                            İptal
                        </Button>
                        <Button variant="destructive" onClick={handleClearLogs}>
                            Sil
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Toast */}
            {toast && <Toast {...toast} onClose={hideToast} />}
        </div>
    );
};

export default LogMonitoring;