"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Book, User, UserPlus, LogOut, Settings, PlusCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  async function checkUser() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (sessionData.session) {
        setUser(sessionData.session.user)
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", sessionData.session.user.id)
          .single()
        if (profileError) throw profileError
        setIsAdmin(profileData.role === "administrador")
      }
    } catch (error) {
      console.error("Error checking user:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="bg-background shadow-soft">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Book className="h-10 w-10 text-primary mr-2" />
              <div>
                <h1 className="text-2xl font-serif font-bold text-primary">CNP Brasil</h1>
                <p className="text-xs text-secondary">Cadastro Nacional de Presbíteros</p>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link href="/cadastro">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary border-primary hover:bg-primary hover:text-white"
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Novo Cadastro
                        </Button>
                      </Link>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                            <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuItem className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span className="truncate">{user.email}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/perfil")}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Perfil</span>
                        </DropdownMenuItem>
                        {isAdmin && (
                          <DropdownMenuItem onClick={() => router.push("/painel-de-controle")}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Painel de Controle</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sair</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary hover:text-white">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                    <Link href="/cadastro">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary hover:text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Cadastro
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
