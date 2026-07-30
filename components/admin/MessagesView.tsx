"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Mail,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  Reply,
  Trash2,
  Star,
  Search,
  Filter,
  Send,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  name: string
  company: string
  email: string
  role: string
  subject: string
  message: string
  time: string
  read: boolean
  starred: boolean
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    name: "Marc Durand",
    company: "Meta",
    email: "m.durand@meta.com",
    role: "Engineering Director",
    subject: "Opportunité Lead Architect Full Stack & AI (Paris / Remote)",
    message: "Bonjour Socrate, j'ai particulièrement apprécié votre projet Multi-Agent RAG Orchestrator. Nous cherchons un Lead Architect pour piloter nos équipes AI Infrastructure. Seriez-vous ouvert à un échange téléphonique cette semaine ?",
    time: "Aujourd'hui 09:42",
    read: false,
    starred: true,
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    company: "Amazon Web Services",
    email: "sjenkins@amazon.com",
    role: "Principal Talent Acquisition",
    subject: "Senior Cloud & DevOps Solutions Architect Role",
    message: "Hi Socrate, your Kubernetes operator implementation and AWS architectures are top notch. I'd love to connect regarding a Senior Principal Architect position at AWS.",
    time: "Hier 15:20",
    read: false,
    starred: true,
  },
  {
    id: "3",
    name: "Alexandre Dupont",
    company: "Vercel",
    email: "alexandre@vercel.com",
    role: "Staff Frontend Architect",
    subject: "Impressionné par les performances de votre Portfolio Next.js 16",
    message: "Hello Socrate, félicitations pour la qualité et la fluidité de votre dashboard portfolio. Votre maîtrise de Next.js, Framer Motion et React Server Components est remarquable.",
    time: "28 Jul 11:15",
    read: true,
    starred: false,
  },
]

export function MessagesView() {
  const { toast } = useToast()
  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES)
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(INITIAL_MESSAGES[0])
  const [replyText, setReplyText] = React.useState("")

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return
    toast({
      title: "Réponse envoyée 🚀",
      description: `Votre email a été envoyé à ${selectedMessage.name} (${selectedMessage.email}).`,
    })
    setReplyText("")
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail className="h-6 w-6 text-pink-500" />
            Boîte de Réception Recruteurs & Contacts ({messages.filter((m) => !m.read).length} non lus)
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Gestion centralisée des opportunités de carrière et demandes de consultants
          </p>
        </div>
      </div>

      {/* Inbox Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Left: Message List */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col space-y-3 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <Input placeholder="Rechercher recruteur, entreprise..." className="pl-8 h-8 text-xs bg-transparent" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg)
                  setMessages(messages.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? "bg-indigo-600/10 border-indigo-500/40 shadow-sm"
                    : msg.read
                    ? "bg-white/40 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-80"
                    : "bg-white dark:bg-zinc-900 border-indigo-500/30 shadow-sm font-semibold"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">{msg.name}</span>
                  <span className="text-[10px] text-zinc-400 shrink-0">{msg.time}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none mb-1.5">
                  {msg.company} • {msg.role}
                </Badge>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 font-medium">{msg.subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Message Detail Pane */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between overflow-y-auto">
          {selectedMessage ? (
            <div className="space-y-6 flex-1">
              <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{selectedMessage.subject}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="font-semibold text-zinc-900 dark:text-white">{selectedMessage.name}</span>
                    <span>({selectedMessage.email})</span>
                    <span>•</span>
                    <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/30 text-[10px]">
                      {selectedMessage.company} ({selectedMessage.role})
                    </Badge>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 font-mono">{selectedMessage.time}</span>
              </div>

              {/* Body */}
              <div className="p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
                {selectedMessage.message}
              </div>

              {/* Reply Box */}
              <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <h4 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                  <Reply className="h-3.5 w-3.5 text-indigo-500" /> Répondre à {selectedMessage.name}
                </h4>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Bonjour ${selectedMessage.name}, merci pour votre message...`}
                  className="w-full h-24 p-3 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-zinc-900 dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <Button onClick={handleSendReply} size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 rounded-xl">
                    <Send className="h-3.5 w-3.5" /> Envoyer la Réponse
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-400 text-xs">
              Sélectionnez un message pour afficher les détails.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
