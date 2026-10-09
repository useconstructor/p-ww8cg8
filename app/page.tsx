'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  Search,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Menu,
  Store,
  Clock,
  Database,
  Shield,
  Zap,
  BarChart3,
  Users,
  Mail,
  Phone,
  MapPin,
  ChevronRight
} from 'lucide-react'

interface Product {
  id: number
  name: string
  sku: string
  quantity: number
  price: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [newProduct, setNewProduct] = useState({ name: '', sku: '', quantity: '', price: '' })
  const [addingProduct, setAddingProduct] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({ name: '', sku: '', quantity: '', price: '' })

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data)
    } catch {
      console.error('Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!newProduct.name || !newProduct.sku) return

    setAddingProduct(true)
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          sku: newProduct.sku,
          quantity: parseInt(newProduct.quantity) || 0,
          price: parseFloat(newProduct.price) || 0
        })
      })
      if (res.ok) {
        setNewProduct({ name: '', sku: '', quantity: '', price: '' })
        fetchProducts()
      }
    } catch {
      console.error('Error adding product')
    } finally {
      setAddingProduct(false)
    }
  }

  async function handleDeleteProduct(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' })
      fetchProducts()
    } catch {
      console.error('Error deleting product')
    }
  }

  function startEditing(product: Product) {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      sku: product.sku,
      quantity: product.quantity.toString(),
      price: product.price.toString()
    })
  }

  async function handleSaveEdit(id: number) {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          sku: editForm.sku,
          quantity: parseInt(editForm.quantity) || 0,
          price: parseFloat(editForm.price) || 0
        })
      })
      setEditingId(null)
      fetchProducts()
    } catch {
      console.error('Error updating product')
    }
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    setContactStatus('sending')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CONSTRUCTOR_API}/v1/forms/${process.env.NEXT_PUBLIC_PROJECT_ID}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactForm)
        }
      )
      if (res.ok) {
        setContactStatus('success')
      } else {
        setContactStatus('error')
      }
    } catch {
      setContactStatus('error')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProducts = products.reduce((sum, p) => sum + p.quantity, 0)
  const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0)

  const navLinks = [
    { label: 'Inventario', href: '#inventario' },
    { label: 'Características', href: '#caracteristicas' },
    { label: 'Testimonios', href: '#testimonios' },
    { label: 'Precios', href: '#precios' },
    { label: 'Contacto', href: '#contacto' }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-[#0DB8A6]" />
              <span className="font-bold text-xl text-[#1F2937]" style={{ fontFamily: 'var(--font-heading)' }}>
                Inventario Productos
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#6B7280] hover:text-[#0DB8A6] transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-6 h-6 text-[#1F2937]" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-[#6B7280] hover:text-[#0DB8A6] transition-all duration-300"
                style={{ transitionDelay: mobileMenuOpen ? `${index * 60}ms` : '0ms' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-[#0DB8A6]/10 text-[#0DB8A6] text-sm font-medium rounded-full mb-6">
            Gestión de inventario simplificada
          </span>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1F2937] mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Gestiona tu inventario en segundos
          </h1>
          <p className="text-lg sm:text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Registra, busca y controla el stock de tu tienda sin complicaciones
          </p>
          <Button
            asChild
            className="bg-[#0DB8A6] hover:bg-[#0A9A8C] text-white px-8 py-6 text-lg rounded-md"
          >
            <a href="#inventario">
              Comenzar
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-8 bg-[#F9F9F9] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-[#1F2937]">1,200+</p>
              <p className="text-sm text-[#6B7280]">tiendas activas</p>
            </div>
            <div className="text-center md:text-left md:border-l md:pl-8 border-gray-200">
              <p className="text-2xl font-bold text-[#1F2937]">98.7%</p>
              <p className="text-sm text-[#6B7280]">disponibilidad</p>
            </div>
            <div className="text-center md:text-left md:border-l md:pl-8 border-gray-200">
              <p className="text-2xl font-bold text-[#1F2937]">+50,000</p>
              <p className="text-sm text-[#6B7280]">productos registrados hoy</p>
            </div>
            <div className="text-center md:text-left md:border-l md:pl-8 border-gray-200">
              <p className="text-2xl font-bold text-[#1F2937]">Sin límite</p>
              <p className="text-sm text-[#6B7280]">datos guardados localmente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Inventory Section */}
      <section id="inventario" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#1F2937] mb-8 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Inventario Actual
          </h2>

          {/* Add Product Form */}
          <div className="bg-[#F9F9F9] p-4 sm:p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Agregar Producto</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Ej: Camiseta Azul"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                className="bg-white"
                required
              />
              <Input
                placeholder="SKU-001"
                value={newProduct.sku}
                onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                className="bg-white"
                required
              />
              <Input
                type="number"
                placeholder="Cantidad"
                min="0"
                value={newProduct.quantity}
                onChange={e => setNewProduct({ ...newProduct, quantity: e.target.value })}
                className="bg-white"
              />
              <Input
                type="number"
                placeholder="$0.00"
                min="0"
                step="0.01"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                className="bg-white"
              />
              <Button
                type="submit"
                disabled={addingProduct}
                className="bg-[#0DB8A6] hover:bg-[#0A9A8C] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {addingProduct ? 'Agregando...' : 'Agregar'}
              </Button>
            </form>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              placeholder="Buscar por nombre o SKU"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Products Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9F9F9] border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937]">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937]">Nombre</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937]">SKU</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937]">Cantidad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937]">Precio Unitario</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#1F2937]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                        Cargando productos...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[#6B7280]">
                        {searchQuery ? 'No se encontraron productos' : 'No hay productos en el inventario'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <tr
                        key={product.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}
                      >
                        {editingId === product.id ? (
                          <>
                            <td className="px-4 py-3 text-sm text-[#6B7280]">{product.id}</td>
                            <td className="px-4 py-3">
                              <Input
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={editForm.sku}
                                onChange={e => setEditForm({ ...editForm, sku: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="0"
                                value={editForm.quantity}
                                onChange={e => setEditForm({ ...editForm, quantity: e.target.value })}
                                className="h-8 text-sm w-20"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.price}
                                onChange={e => setEditForm({ ...editForm, price: e.target.value })}
                                className="h-8 text-sm w-24"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(product.id)}
                                  className="bg-[#0DB8A6] hover:bg-[#0A9A8C] text-white h-8 px-2"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingId(null)}
                                  className="h-8 px-2"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-4 py-3 text-sm text-[#6B7280]">{product.id}</td>
                            <td className="px-4 py-3 text-sm text-[#1F2937] font-medium">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-[#6B7280]">{product.sku}</td>
                            <td className="px-4 py-3 text-sm text-[#1F2937]">{product.quantity}</td>
                            <td className="px-4 py-3 text-sm text-[#1F2937]">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditing(product)}
                                  className="h-8 px-2"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-[#F9F9F9] rounded-lg border border-gray-200">
            <p className="text-[#1F2937] font-medium">
              Total de productos: <span className="text-[#0DB8A6]">{totalProducts}</span>
            </p>
            <p className="text-[#1F2937] font-medium">
              Valor total inventario: <span className="text-[#0DB8A6]">${totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#1F2937] mb-4 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Características
          </h2>
          <p className="text-[#6B7280] text-center mb-12 max-w-2xl mx-auto">
            Todo lo que necesitas para gestionar tu inventario de forma eficiente
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'Acceso inmediato', desc: 'Sin registro ni pantalla de login, empieza a usar la herramienta al instante' },
              { icon: Package, title: 'Gestión completa', desc: 'Agrega, edita y elimina productos con nombre, SKU, cantidad y precio' },
              { icon: Search, title: 'Búsqueda en tiempo real', desc: 'Encuentra cualquier producto al instante por nombre o SKU' },
              { icon: BarChart3, title: 'Estadísticas automáticas', desc: 'Consulta el total de productos y valor del inventario en un vistazo' },
              { icon: Database, title: 'Persistencia de datos', desc: 'Tu información se guarda automáticamente y se conserva entre sesiones' },
              { icon: Shield, title: 'Validación inteligente', desc: 'Campos validados para evitar errores en el registro de productos' }
            ].map((feature, i) => (
              <Card key={i} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-[#0DB8A6]/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#0DB8A6]" />
                  </div>
                  <h3 className="font-semibold text-[#1F2937] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#6B7280]">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#1F2937] mb-4 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-[#6B7280] text-center mb-12 max-w-2xl mx-auto">
            Miles de comercios ya confían en Inventario Productos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'Dejé de perder tiempo en hojas de cálculo. Ahora controlo todo desde aquí.',
                name: 'María García',
                role: 'Propietaria de tienda, Buenos Aires',
                initials: 'MG'
              },
              {
                quote: 'Perfecto para mi pequeño negocio. Simple, rápido y sin suscripciones confusas.',
                name: 'Carlos Mendez',
                role: 'Gerente de inventario, Mexico City',
                initials: 'CM'
              },
              {
                quote: 'Llevo tres meses usándolo. Cero problemas, mis datos siempre están.',
                name: 'Rosa Hernández',
                role: 'Dueña de boutique, Madrid',
                initials: 'RH'
              }
            ].map((testimonial, i) => (
              <Card key={i} className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <p className="text-[#1F2937] mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0DB8A6]/10 flex items-center justify-center text-[#0DB8A6] font-semibold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937] text-sm">{testimonial.name}</p>
                      <p className="text-xs text-[#6B7280]">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#1F2937] mb-4 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Planes y precios
          </h2>
          <p className="text-[#6B7280] text-center mb-12 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu negocio
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#1F2937]">Gratis</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#1F2937]">$0</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {['100 productos máximo', 'Búsqueda básica', 'Datos guardados 30 días', 'Soporte por email'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#0DB8A6]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <a href="#inventario">Comenzar gratis</a>
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-white border-2 border-[#0DB8A6] relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#0DB8A6] text-white text-xs font-medium rounded-full">
                Popular
              </div>
              <CardHeader>
                <CardTitle className="text-[#1F2937]">Profesional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-[#1F2937]">$9.99</span>
                  <span className="text-[#6B7280]">/mes</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {['5,000 productos', 'Búsqueda avanzada', 'Datos guardados indefinido', 'Historial de cambios', 'Soporte prioritario'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#0DB8A6]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full bg-[#0DB8A6] hover:bg-[#0A9A8C] text-white">
                  <a href="#contacto">Elegir plan</a>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-[#1F2937]">Empresarial</CardTitle>
                <div className="mt-4">
                  <span className="text-2xl font-bold text-[#1F2937]">Precio personalizado</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {['Productos ilimitados', 'API para integraciones', 'Múltiples usuarios', 'Reportes avanzados', 'Soporte dedicado'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <Check className="w-4 h-4 text-[#0DB8A6]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="w-full">
                  <a href="#contacto">Contactar ventas</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl font-bold text-[#1F2937] mb-4 text-center"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Contáctanos
          </h2>
          <p className="text-[#6B7280] text-center mb-8">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>

          {contactStatus === 'success' ? (
            <div className="bg-[#0DB8A6]/10 border border-[#0DB8A6] rounded-lg p-6 text-center">
              <Check className="w-12 h-12 text-[#0DB8A6] mx-auto mb-4" />
              <p className="text-[#1F2937] font-medium">Mensaje enviado</p>
              <p className="text-[#6B7280] text-sm">Te contactaremos pronto</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Nombre</label>
                <Input
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Email</label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Mensaje</label>
                <textarea
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={4}
                  required
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {contactStatus === 'error' && (
                <p className="text-red-500 text-sm">Error al enviar el mensaje. Por favor intenta de nuevo.</p>
              )}
              <Button
                type="submit"
                disabled={contactStatus === 'sending'}
                className="w-full bg-[#0DB8A6] hover:bg-[#0A9A8C] text-white"
              >
                {contactStatus === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F2937] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-8 h-8 text-[#0DB8A6]" />
                <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                  Inventario Productos
                </span>
              </div>
              <p className="text-gray-400 text-sm max-w-sm">
                Aplicación web de inventario para pequeños y medianos comercios. Gestiona tu stock de forma simple y eficiente.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#inventario" className="hover:text-[#0DB8A6] transition-colors">Inventario</a></li>
                <li><a href="#caracteristicas" className="hover:text-[#0DB8A6] transition-colors">Características</a></li>
                <li><a href="#precios" className="hover:text-[#0DB8A6] transition-colors">Precios</a></li>
                <li><a href="#contacto" className="hover:text-[#0DB8A6] transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:contacto@inventariopro.com" className="hover:text-[#0DB8A6] transition-colors">
                    contacto@inventariopro.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Inventario Productos. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
