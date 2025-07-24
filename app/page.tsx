"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, FileText, Users, Settings, BookOpen, Play, Zap } from "lucide-react"
import { EnterpriseDemoButton } from "@/components/EnterpriseDemo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Sistema de Investigación v3.0
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Platform RSRCH
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema completo para preparación de entrevistas con investigación asistida por IA,
            gestión de fuentes y control de calidad integrado.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/requests">
              <Button size="lg">
                <ArrowRight className="h-5 w-5 mr-2" />
                Ir al Sistema
              </Button>
            </Link>
            
            <EnterpriseDemoButton />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Gestión de Solicitudes</CardTitle>
              <CardDescription className="text-sm">
                Sistema Kanban para tracking de solicitudes desde inicio hasta entrega
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Working Studio</CardTitle>
              <CardDescription className="text-sm">
                Editor colaborativo con IA, gestión de fuentes y módulos personalizables
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Colaboración</CardTitle>
              <CardDescription className="text-sm">
                Trabajo en equipo en tiempo real con cursores colaborativos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Control de Calidad</CardTitle>
              <CardDescription className="text-sm">
                Sistema QC integrado con revisión automatizada y manual
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo CTA */}
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">¿Nuevo en el sistema?</CardTitle>
            <CardDescription className="text-base">
              Ve una demostración completa de todas las funcionalidades.
              El sistema comenzará vacío y te guiará paso a paso.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span>Experiencia guiada</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Datos realistas</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Perfecto para presentaciones, capacitación o exploración del sistema
            </p>
            <EnterpriseDemoButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}