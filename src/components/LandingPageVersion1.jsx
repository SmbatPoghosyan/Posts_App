import React from 'react'

function LandingPageVersion1() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Affordable Auto Parts</h1>
        <p className="text-xl mb-8">Direct from our warehouses to your door.</p>
        <a
          href="mailto:sales@autolinkglobal.com"
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded"
        >
          Contact Us
        </a>
      </header>

      <main className="px-6 space-y-16">
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Why Choose Us</h2>
          <ul className="space-y-2 list-disc pl-5">
            <li>Factory direct prices</li>
            <li>Fast worldwide shipping</li>
            <li>Warranty on all parts</li>
          </ul>
        </section>

        <section className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-semibold mb-4">Ready to Save?</h2>
          <p className="mb-6">Join hundreds of shops benefiting from our low pricing.</p>
          <a
            href="#start"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded"
          >
            Start Now
          </a>
        </section>

        <section id="start" className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Get Started</h2>
          <p className="mb-6">Send us your parts list and we will quote you today.</p>
          <a
            href="mailto:sales@autolinkglobal.com"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded"
          >
            Email Us
          </a>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-gray-400">
        © 2025 AutoLink Global
      </footer>
    </div>
  )
}

export default LandingPageVersion1
