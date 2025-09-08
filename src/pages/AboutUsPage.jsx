import React from 'react';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Kici Perfume</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Crafting exceptional fragrances that tell your unique story since 2020. 
            We believe every person deserves a signature scent that captures their essence.
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2020 by fragrance enthusiasts, Kici Perfume began as a passion project to make 
                luxury fragrances accessible to everyone. We noticed a gap in the market for high-quality, 
                affordable perfumes that didn't compromise on sophistication or longevity.
              </p>
              <p className="text-gray-600 mb-4">
                Starting from a small studio, we've grown into a trusted name in the fragrance industry, 
                serving thousands of customers worldwide. Our commitment to quality, authenticity, and 
                customer satisfaction remains at the heart of everything we do.
              </p>
              <p className="text-gray-600">
                Today, we continue to curate the finest fragrances from renowned perfumers and emerging 
                artists, ensuring our customers have access to both timeless classics and innovative new scents.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=400&fit=crop" 
                alt="Perfume bottles" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                To democratize luxury fragrances and help everyone discover their perfect scent
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
                <p className="text-gray-600">We source only authentic, high-quality fragrances from trusted suppliers and renowned perfumers.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Love</h3>
                <p className="text-gray-600">Your satisfaction is our priority. We're here to help you find your perfect fragrance match.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">We continuously explore new fragrances and technologies to enhance your shopping experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Authenticity",
                description: "Every fragrance we sell is 100% authentic and genuine.",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              },
              {
                title: "Sustainability",
                description: "We're committed to eco-friendly packaging and practices.",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              },
              {
                title: "Transparency",
                description: "Clear pricing, honest reviews, and open communication.",
                icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              },
              {
                title: "Excellence",
                description: "We strive for perfection in every aspect of our service.",
                icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The passionate people behind Kici Perfume</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Ravi Sharma",
                role: "Customer",
                image: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=300&h=300&fit=crop&crop=face",
                description: "I purchased Breezy and it’s just perfect for daily use. The fragrance is refreshing and premium at this price."
              },
              {
                name: "Priya Mehta",
                role: "Customer",
                image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&h=300&fit=crop&crop=face",
                description: "Kici Flora is absolutely lovely 😍. The floral notes feel natural and long-lasting. Everyone keeps asking me about it."
              },
              {
                name: "Arjun Verma",
                role: "Customer",
                image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
                description: "Owd Cambodian is strong, rich, and classy – perfect for evenings. The quality is top-notch and delivery was quick."
              },
              {
                name: "Amit Patel",
                role: "Customer",
                image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
                description: "I purchased Oud Cambodian and it’s a great addition to my collection. The scent is rich and long-lasting."
              },
              {
                name: "Deepak Singh",
                role: "Customer",
                image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face",
                description: "I purchased Oud Cambodian and it’s a great addition to my collection. The scent is rich and long-lasting."
              },
              {
                name: "Rajesh Kumar",
              }            
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl mb-6 opacity-90">
              Have questions about our fragrances or need personalized recommendations?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:hello@kiciperfume.com" 
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
              >
                Email Us
              </a>
              <a 
                href="tel:+15551234567" 
                className="bg-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors duration-300"
              >
                Call Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
