"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FixRolePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>("")

  const fixUserRole = async () => {
    setIsLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/debug/fix-user-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "a69c8401-6b86-4e45-a9e7-3cca39260eb2",
          newRole: "advisor"
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`✅ Success: ${data.message}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Fix User Role</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              This will update ZAYNAB's role from "admin" to "advisor" in the database.
            </p>
            <p className="text-sm text-gray-600">
              User ID: a69c8401-6b86-4e45-a9e7-3cca39260eb2<br/>
              Email: speakwithnafiu@gmail.com<br/>
              Current Role: admin → New Role: advisor
            </p>
            
            <Button 
              onClick={fixUserRole} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Updating..." : "Fix User Role"}
            </Button>
            
            {result && (
              <div className="p-4 rounded bg-gray-100">
                <pre className="text-sm">{result}</pre>
              </div>
            )}
            
            <div className="text-sm text-gray-500">
              <p><strong>After fixing:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Logout from the current session</li>
                <li>Go to the advisor login page</li>
                <li>Login again with the same credentials</li>
                <li>You should now be redirected to the advisor dashboard</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}