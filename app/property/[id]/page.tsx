'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash } from 'lucide-react'
import { Property } from '@/types/supabase'
import { propertyApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const data = await propertyApi.getBySerialNumber(params.id)
        setProperty(data)
      } catch (err: any) {
        setError(err.message || '获取物料信息失败')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  const handleDelete = async () => {
    try {
      if (!property) return
      await propertyApi.delete(property.id)
      router.push('/')
    } catch (err: any) {
      setDeleteError(err.message || '删除物料失败')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
        <Alert>
          <AlertDescription>未找到对应的物料信息</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Link>
        </div>

        {deleteError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{property.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">序列号</div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">{property.serial_number}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">状态</div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">{property.status}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">购买日期</div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">
                  {property.purchase_date ? new Date(property.purchase_date).toLocaleDateString() : '未知'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">购买价值</div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">
                  {property.purchase_value ? `¥${property.purchase_value.toLocaleString()}` : '未知'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">当前价值</div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">
                  {property.current_value ? `¥${property.current_value.toLocaleString()}` : '未知'}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">位置</div>
                <div className="mt-1 text-gray-900 dark:text-gray-100">{property.location || '未知'}</div>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">描述</div>
              <div className="mt-1 text-gray-900 dark:text-gray-100">{property.description || '无'}</div>
            </div>

            {property.metadata && (
              <div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">其他信息</div>
                <pre className="mt-1 text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {JSON.stringify(property.metadata, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => router.push(`/property/${params.id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            编辑
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            <Trash className="w-4 h-4 mr-2" />
            删除
          </Button>
        </div>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除这个物料吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
} 