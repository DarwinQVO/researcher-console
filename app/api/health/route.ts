import { NextResponse } from 'next/server'

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '0.1.0',
    demo_mode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  }

  return NextResponse.json(healthCheck, { status: 200 })
}