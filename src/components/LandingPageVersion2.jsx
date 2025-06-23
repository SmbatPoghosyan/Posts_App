import React from 'react'

function LandingPageVersion2() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-red-50 to-purple-50 text-gray-900 font-serif">
      <header className="py-24 text-center">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight">Premium Parts Delivered</h1>
        <p className="text-2xl mb-10">Quality components for every model.</p>
        <a
          href="#quote"
          className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded"
        >
          Request Quote
        </a>
      </header>

      <main className="space-y-20 px-6">
        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" id="quote">
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">Extensive Catalog</h2>
            <p>Thousands of part numbers stocked and ready to ship.</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">Doorstep Delivery</h2>
            <p>Rapid logistics to keep your shop moving.</p>
          </div>
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">Dedicated Support</h2>
            <p>Our team helps you find exactly what you need.</p>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-4xl font-extrabold mb-4">Let's Talk</h2>
          <p className="mb-6">Schedule a quick consultation and discover how we simplify sourcing.</p>
          <a
            href="mailto:sales@autolinkglobal.com"
            className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded"
          >
            Email Sales
          </a>
        </section>
      </main>

      <footer className="py-10 text-center text-sm text-gray-600">
        © 2025 AutoLink Global - Version 2
      </footer>
    </div>
  )
}

export default LandingPageVersion2
