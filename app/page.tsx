'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'

interface MemeCoin {
  id: string
  name: string
  symbol: string
  contractAddress: string
  launchTime: Date
  marketCap: number
  liquidityLocked: boolean
  ownershipRenounced: boolean
  topHoldersPercentage: number
  rugPullRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  riskScore: number
  honeypot: boolean
  tradingEnabled: boolean
}

export default function Home() {
  const [coins, setCoins] = useState<MemeCoin[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isScanning, setIsScanning] = useState(true)

  const generateMockCoin = (): MemeCoin => {
    const names = [
      'PepeElonMoon', 'DogeKiller', 'SafeRocketInu', 'FlokiShiba', 'BabyDoge2.0',
      'MoonShibaElonInu', 'SafePepe', 'RocketFloki', 'MetaDoge', 'ShibaRocket',
      'ElonDogeInu', 'SafeMoonPepe', 'FlokiRocket', 'BabyShiba', 'MegaDoge'
    ]

    const liquidityLocked = Math.random() > 0.4
    const ownershipRenounced = Math.random() > 0.5
    const topHoldersPercentage = Math.floor(Math.random() * 80) + 10
    const honeypot = Math.random() > 0.85
    const tradingEnabled = Math.random() > 0.1

    let riskScore = 0
    if (!liquidityLocked) riskScore += 40
    if (!ownershipRenounced) riskScore += 25
    if (topHoldersPercentage > 50) riskScore += 20
    if (honeypot) riskScore += 50
    if (!tradingEnabled) riskScore += 30

    let rugPullRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    if (riskScore >= 80) rugPullRisk = 'CRITICAL'
    else if (riskScore >= 50) rugPullRisk = 'HIGH'
    else if (riskScore >= 25) rugPullRisk = 'MEDIUM'
    else rugPullRisk = 'LOW'

    const name = names[Math.floor(Math.random() * names.length)]
    const symbol = name.substring(0, Math.min(name.length, 5)).toUpperCase()

    return {
      id: Math.random().toString(36).substr(2, 9),
      name,
      symbol,
      contractAddress: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      launchTime: new Date(),
      marketCap: Math.floor(Math.random() * 1000000) + 10000,
      liquidityLocked,
      ownershipRenounced,
      topHoldersPercentage,
      rugPullRisk,
      riskScore,
      honeypot,
      tradingEnabled
    }
  }

  useEffect(() => {
    const scanForNewCoins = () => {
      const newCoin = generateMockCoin()
      setCoins(prev => [newCoin, ...prev].slice(0, 20))
      setLastUpdate(new Date())
    }

    scanForNewCoins()
    const interval = setInterval(scanForNewCoins, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return '#10b981'
      case 'MEDIUM': return '#f59e0b'
      case 'HIGH': return '#ef4444'
      case 'CRITICAL': return '#dc2626'
      default: return '#6b7280'
    }
  }

  const getRiskEmoji = (risk: string) => {
    switch (risk) {
      case 'LOW': return '✅'
      case 'MEDIUM': return '⚠️'
      case 'HIGH': return '🚨'
      case 'CRITICAL': return '☠️'
      default: return '❓'
    }
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
          🚀 Meme Coin Tracker
        </h1>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', opacity: 0.9 }}>
          Real-time monitoring with rug pull risk analysis
        </p>
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '1rem 2rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Scan Interval</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>5 minutes</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '1rem 2rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Coins Tracked</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{coins.length}</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '1rem 2rem',
            borderRadius: '10px',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Last Scan</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
      }}>
        {coins.map(coin => (
          <div
            key={coin.id}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
              padding: '1.5rem',
              border: `2px solid ${getRiskColor(coin.rugPullRisk)}`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {coin.name}
                </h2>
                <p style={{ opacity: 0.8 }}>${coin.symbol}</p>
              </div>
              <div style={{
                fontSize: '2rem',
                background: getRiskColor(coin.rugPullRisk),
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getRiskEmoji(coin.rugPullRisk)}
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1rem'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <span style={{ opacity: 0.8, fontSize: '0.9rem' }}>Risk Level: </span>
                <span style={{
                  fontWeight: 'bold',
                  color: getRiskColor(coin.rugPullRisk),
                  fontSize: '1.1rem'
                }}>
                  {coin.rugPullRisk}
                </span>
                <span style={{ opacity: 0.7, marginLeft: '0.5rem' }}>
                  ({coin.riskScore}/100)
                </span>
              </div>

              <div style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                <div>
                  {coin.liquidityLocked ? '🔒' : '🔓'} Liquidity: {coin.liquidityLocked ? 'Locked' : 'Unlocked'}
                </div>
                <div>
                  {coin.ownershipRenounced ? '✅' : '❌'} Ownership: {coin.ownershipRenounced ? 'Renounced' : 'Not Renounced'}
                </div>
                <div>
                  📊 Top Holders: {coin.topHoldersPercentage}%
                </div>
                <div>
                  {coin.honeypot ? '🍯❌' : '✅'} Honeypot: {coin.honeypot ? 'Detected!' : 'Not Detected'}
                </div>
                <div>
                  {coin.tradingEnabled ? '✅' : '❌'} Trading: {coin.tradingEnabled ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.75rem' }}>
              <div>💰 Market Cap: ${coin.marketCap.toLocaleString()}</div>
              <div>🕐 Launched: {formatDistanceToNow(coin.launchTime, { addSuffix: true })}</div>
            </div>

            <div style={{
              fontSize: '0.75rem',
              opacity: 0.6,
              wordBreak: 'break-all',
              background: 'rgba(0,0,0,0.2)',
              padding: '0.5rem',
              borderRadius: '5px'
            }}>
              📋 {coin.contractAddress}
            </div>
          </div>
        ))}
      </div>

      {coins.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '15px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Scanning for new meme coins...</h2>
          <p style={{ opacity: 0.8 }}>New tokens will appear here every 5 minutes</p>
        </div>
      )}
    </main>
  )
}
