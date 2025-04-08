"use client"

import { LoginForm } from "@/components/login-form"
import { motion } from "framer-motion"
import { School, CheckCircle, Shield, Users } from "lucide-react"


export default function Home() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Левая часть - информация о системе */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=800')] opacity-10 bg-cover bg-center" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
              <img src="/kit-icon.svg" alt="kit_logo" />
            <h1 className="text-3xl font-bold text-white">EduManage Pro</h1>
          </div>
          <p className="mt-2 text-white/80 text-lg">Современная система управления образовательным процессом</p>
        </div>

        <motion.div
          className="relative z-10 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Удобное управление</h3>
              <p className="text-white/70">
                Интуитивно понятный интерфейс для эффективного управления учебным процессом
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Безопасность данных</h3>
              <p className="text-white/70">Надежная защита персональных данных и разграничение прав доступа</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Для всех участников</h3>
              <p className="text-white/70">Специальные интерфейсы для администраторов, преподавателей и проверяющих</p>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 text-white/60 text-sm">© 2023 EduManage Pro. Все права защищены.</div>
      </div>

      {/* Правая часть - форма входа */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <School className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">EduManage Pro</h1>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Нужна помощь?{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Свяжитесь с нами
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
