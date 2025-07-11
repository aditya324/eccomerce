// components/PackageTabs.jsx
"use client"
import { useEffect, useState } from 'react'
import axios from 'axios'
import PlanCards from './PlanCards'
import { BASEURL } from '@/constants'



const categories = [
  { slug: 'test-category', label: 'Social Media Management' },
  { slug: 'test-category2',      label: 'SEO (Local & On-Page)'    },
  { slug: 'performance-marketing',  label: 'Performance Marketing'   },
  
]

export default function PackageTabs() {
  const [active, setActive] = useState(categories[0].slug)
  const [plansByCat, setPlansByCat] = useState({})    
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    if (!plansByCat[active]) {
      setLoading(true)
      axios
        .get(`${BASEURL}/package/slug/${active}`)
        .then(({ data }) =>
          setPlansByCat(prev => ({ ...prev, [active]: data }))
        )
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [active, plansByCat])

  return (
    <div>
      {/* Tabs */}
      <nav className="flex space-x-4 overflow-auto border-b ">
        {categories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => setActive(cat.slug)}
            className={
              'py-2 px-3 whitespace-nowrap ' +
              (active === cat.slug
                ? 'border-b-2 border-yellow-500 font-semibold'
                : 'text-gray-600 hover:text-gray-800')
            }
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="mt-6 px-10">
        {loading && !plansByCat[active] ? (
          <p className="text-center">Loading plans…</p>
        ) : (
          <PlanCards
            plans={plansByCat[active] || []}
            onSelectPlan={plan => {
              console.log('selected plan', plan)
            }}
          />
        )}
      </div>
    </div>
  )
}
