"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { axiosClient } from "@/lib/utils"

type Note = {
  _id: string
  title: string
  body: string
  releaseAt: string
  webhookURL: string
  status: "pending" | "delivered" | "failed"
  attempts: Array<{
    _id?: string
    at: string
    statusCode: number,
    error?: string
    ok: boolean
  }>
  deliveredAt: string | null
  createdAt: string
  updatedAt: string
}

const getStatusBadge = (status: string) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    delivered: "bg-green-100 text-green-800 border-green-200", 
    failed: "bg-red-100 text-red-800 border-red-200"
  }
  
  const icons = {
    pending: <Clock className="w-3 h-3 mr-1" />,
    delivered: <CheckCircle className="w-3 h-3 mr-1" />,
    failed: <XCircle className="w-3 h-3 mr-1" />
  }

  return (
    <Badge className={`${variants[status as keyof typeof variants]} flex items-center w-fit`}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

const getStatusCodeBadge = (statusCode: string) => {
  const variants = {
    // pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    '200': "bg-green-100 text-green-800 border-green-200", 
    '500': "bg-red-100 text-red-800 border-red-200"
  }
  
  const icons = {
    pending: <Clock className="w-3 h-3 mr-1" />,
    delivered: <CheckCircle className="w-3 h-3 mr-1" />,
    failed: <XCircle className="w-3 h-3 mr-1" />
  }

  return (
    <Badge className={`${variants[statusCode as keyof typeof variants]} flex items-center w-fit`}>
      {icons[statusCode as keyof typeof icons]}
      {statusCode}
    </Badge>
  )
}

// Helper function to copy text to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    // document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

export const columns: ColumnDef<Note>[] = [
  {
    accessorKey: "_id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("_id") as string
      const shortId = id.slice(-8) // Show last 8 characters
      
      return (
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
            {shortId}
          </code>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(id)}
            title="Copy full ID"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string
      return (
        <div className="font-medium max-w-[200px] truncate" title={title}>
          {title}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status", 
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return getStatusBadge(status)
    },
  },
  
  {
    accessorKey: "webhookURL",
    header: "Webhook URL",
    cell: ({ row }) => {
      const url = row.getValue("webhookURL") as string
      const displayUrl = url.length > 30 ? url.substring(0, 30) + "..." : url
      
      return (
        <div className="flex items-center gap-2">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono max-w-[200px] truncate">
            {displayUrl}
          </code>
          <Button
            variant="ghost"
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={() => copyToClipboard(url)}
            title="Copy URL"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: "attempts",
    header: "Last Attempt Code",
    cell: ({ row }) => {
      const attempts = row.getValue("attempts") as Note['attempts']
      
      if (!attempts || attempts.length === 0) {
        return (
          <div className="text-sm text-gray-400 italic">
            No attempts
          </div>
        )
      }
      
      // Get the last attempt (most recent)
      const lastAttempt = attempts[attempts.length - 1]
      // const attemptTime = formatDate(lastAttempt.attemptedAt)
      
      return getStatusCodeBadge((lastAttempt.statusCode).toString())
    },
  },
  
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const note = row.original
      
      return (
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={ async () => {
          console.log("rowId: ",row.getValue("_id"))
          // await axiosClient.post()
        }}>Replay</Button>
      )
    },
  },
] 