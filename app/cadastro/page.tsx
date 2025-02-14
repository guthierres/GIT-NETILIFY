"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase, uploadFile } from "@/lib/supabaseClient"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Upload, Facebook, Instagram, Globe } from "lucide-react"
import { BackToHomeButton } from "@/components/BackToHomeButton"
import Link from "next/link"

export default function Cadastro() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nome_completo: "",
    grau_ordem: "",
    diocese: "",
    data_ordenacao: "",
    bispo_ordenante: "",
    ocupacao_canonica: "",
    nome_paroquia: "",
    foto_perfil: null,
    documento_ordenacao: null,
    facebook: "",
    instagram: "",
    website: "",
    email: "",
    telefone: "",
    senha: "",
    confirmar_senha: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fieldName = e.target.name
      if (file.size <= 200 * 1024) {
        setFormData({ ...formData, [fieldName]: file })
      } else {
        alert("O arquivo excede o tamanho máximo permitido (200KB).")
        e.target.value = ""
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAgreed) {
      alert("Por favor, concorde com os termos de uso e privacidade para prosseguir.")
      return
    }
    setIsSubmitting(true)
    try {
      if (formData.senha !== formData.confirmar_senha) {
        throw new Error("As senhas não coincidem.")
      }

      let foto_perfil_url = ""
      let documento_ordenacao_url = ""

      if (formData.foto_perfil instanceof File) {
        foto_perfil_url = await uploadFile(formData.foto_perfil, "fotos_perfil")
      }

      if (formData.documento_ordenacao instanceof File) {
        documento_ordenacao_url = await uploadFile(formData.documento_ordenacao, "documentos_ordenacao")
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      })

      if (authError) throw authError

      // Insert user data into presbiteros table
      const { data, error } = await supabase.from("presbiteros").insert([
        {
          id: authData.user?.id,
          nome_completo: formData.nome_completo,
          grau_ordem: formData.grau_ordem,
          diocese: formData.diocese,
          data_ordenacao: formData.data_ordenacao,
          bispo_ordenante: formData.bispo_ordenante,
          ocupacao_canonica: formData.ocupacao_canonica,
          nome_paroquia: formData.nome_paroquia,
          foto_perfil: foto_perfil_url,
          documento_ordenacao: documento_ordenacao_url,
          facebook: formData.facebook,
          instagram: formData.instagram,
          website: formData.website,
          email: formData.email,
          telefone: formData.telefone,
        },
      ])

      if (error) throw error

      alert("Cadastro realizado com sucesso! Aguarde a aprovação.")
      router.push("/login")
    } catch (error) {
      alert("Erro ao realizar cadastro. Por favor, tente novamente.")
      console.error("Erro:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-light-beige to-white">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <BackToHomeButton />
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-deep-burgundy text-center">Cadastro de Religioso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome_completo">Nome Completo *</Label>
                  <Input type="text" id="nome_completo" name="nome_completo" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grau_ordem">Grau de Ordem *</Label>
                  <Select onValueChange={(value) => handleSelectChange("grau_ordem", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o grau de ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diacono">Diácono</SelectItem>
                      <SelectItem value="presbitero">Presbítero</SelectItem>
                      <SelectItem value="bispo">Bispo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diocese">Diocese *</Label>
                  <Input type="text" id="diocese" name="diocese" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data_ordenacao">Data da Ordenação *</Label>
                  <Input type="date" id="data_ordenacao" name="data_ordenacao" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bispo_ordenante">Bispo Ordenante *</Label>
                  <Input type="text" id="bispo_ordenante" name="bispo_ordenante" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ocupacao_canonica">Ocupação Canônica *</Label>
                  <Select onValueChange={(value) => handleSelectChange("ocupacao_canonica", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a ocupação canônica" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vigario">Vigário</SelectItem>
                      <SelectItem value="paroco">Pároco</SelectItem>
                      <SelectItem value="auxiliar">Auxiliar</SelectItem>
                      <SelectItem value="titular">Titular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome_paroquia">Nome da Paróquia *</Label>
                  <Input type="text" id="nome_paroquia" name="nome_paroquia" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foto_perfil">Foto para o perfil (até 200KB)</Label>
                  <Input type="file" id="foto_perfil" name="foto_perfil" onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento_ordenacao">Comprovante de ordenação (até 200KB) *</Label>
                  <Input
                    type="file"
                    id="documento_ordenacao"
                    name="documento_ordenacao"
                    onChange={handleFileChange}
                    accept=".pdf,image/*"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook (nome de usuário)</Label>
                  <div className="relative">
                    <Facebook className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      id="facebook"
                      name="facebook"
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="seunome.usuario"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (nome de usuário)</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      id="instagram"
                      name="instagram"
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="seunome.usuario"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="url"
                      id="website"
                      name="website"
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="https://www.seusite.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input type="email" id="email" name="email" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input type="tel" id="telefone" name="telefone" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input type="password" id="senha" name="senha" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmar_senha">Confirmar Senha *</Label>
                  <Input type="password" id="confirmar_senha" name="confirmar_senha" onChange={handleChange} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAgreed}
                  onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Eu concordo com os{" "}
                  <Link href="/termos-de-uso" className="text-blue-600 hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/politica-de-privacidade" className="text-blue-600 hover:underline">
                    política de privacidade
                  </Link>
                </label>
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-deep-burgundy text-white transition-colors duration-300"
                  disabled={isSubmitting || !termsAgreed}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar Cadastro
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
