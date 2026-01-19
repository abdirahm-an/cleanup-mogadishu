"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { User } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProfileFormProps {
  user: {
    id: string
    email: string
    name: string
    phone?: string | null
    image?: string | null
    role: string
    createdAt: string
    updatedAt: string
  }
}

interface Neighborhood {
  id: string
  name: string
  district: {
    id: string
    name: string
  }
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    neighborhoodId: "",
  })
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load neighborhoods
  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/neighborhoods")
        const data = await response.json()
        
        if (response.ok) {
          setNeighborhoods(data.neighborhoods)
        } else {
          console.error("Failed to fetch neighborhoods:", data.error)
        }
      } catch (error) {
        console.error("Error fetching neighborhoods:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNeighborhoods()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length > 100) {
      newErrors.name = "Name is too long"
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message || "Profile updated successfully" })
        setTimeout(() => {
          router.push("/profile")
          router.refresh()
        }, 1000)
      } else {
        if (data.details) {
          // Handle validation errors
          const validationErrors: Record<string, string> = {}
          data.details.forEach((error: any) => {
            validationErrors[error.path[0]] = error.message
          })
          setErrors(validationErrors)
        } else {
          setMessage({ type: "error", text: data.error || "Failed to update profile" })
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setSaving(false)
    }
  }

  const groupedNeighborhoods = neighborhoods.reduce((acc, neighborhood) => {
    const districtName = neighborhood.district.name
    if (!acc[districtName]) {
      acc[districtName] = []
    }
    acc[districtName].push(neighborhood)
    return acc
  }, {} as Record<string, Neighborhood[]>)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          {user.image ? (
            <img 
              src={user.image} 
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div className={`p-4 rounded-md ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? "border-red-500" : ""}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          {/* Neighborhood */}
          <div className="space-y-2">
            <label htmlFor="neighborhoodId" className="block text-sm font-medium text-gray-700">
              Neighborhood
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Loading neighborhoods...</div>
            ) : (
              <select
                id="neighborhoodId"
                name="neighborhoodId"
                value={formData.neighborhoodId}
                onChange={handleInputChange}
                className="flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a neighborhood (optional)</option>
                {Object.entries(groupedNeighborhoods).map(([districtName, districtNeighborhoods]) => (
                  <optgroup key={districtName} label={districtName}>
                    {districtNeighborhoods.map((neighborhood) => (
                      <option key={neighborhood.id} value={neighborhood.id}>
                        {neighborhood.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/profile")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}