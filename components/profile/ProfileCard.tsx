import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import Link from "next/link"

interface ProfileCardProps {
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

export function ProfileCard({ user }: ProfileCardProps) {
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
        <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span className="capitalize">{user.role.toLowerCase()}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Mail className="w-5 h-5 text-gray-400" />
            <span>{user.email}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Phone className="w-5 h-5 text-gray-400" />
            <span>{user.phone || "No phone number provided"}</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span>No neighborhood selected</span>
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
          
          <div className="flex items-center gap-3 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4">
          <Link href="/profile/edit">
            <Button className="w-full">
              Edit Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}