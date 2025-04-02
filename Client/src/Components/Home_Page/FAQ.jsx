import React from "react";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10 md:py-16">
      <div className="max-w-3xl mt-5 mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/")} 
          className="flex items-center text-green-600 hover:text-green-700 font-semibold mb-6 transition"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
          Frequently Asked Questions (FAQ)
        </h1>

        {/* FAQ List */}
        <div className="space-y-6">
          {[
            {
              question: "What is EcoSwap?",
              answer: "EcoSwap is a community-driven platform where users can exchange items instead of discarding them, promoting sustainability and reducing waste."
            },
            {
              question: "How does EcoSwap work?",
              answer: "Simply sign up, list items you no longer need, browse available items, chat with other users, and arrange a swap."
            },
            {
              question: "Is EcoSwap free to use?",
              answer: "Yes, EcoSwap is completely free! There are no hidden charges for listing or exchanging items."
            },
            {
              question: "What kind of items can I list on EcoSwap?",
              answer: "You can list books, clothes, electronics, furniture, and other household goods. However, illegal, hazardous, or perishable items are not allowed."
            },
            {
              question: "How do I list an item?",
              answer: 'Go to your dashboard, click on "List Item," provide necessary details like images, description, and category, and post your listing.'
            },
            {
              question: "Can I swap items with users from other cities?",
              answer: "Currently, EcoSwap facilitates local exchanges. If you wish to swap with users from different locations, you need to arrange shipping on your own."
            },
            {
              question: "How do I contact another user?",
              answer: "EcoSwap provides a built-in chat feature that allows users to communicate safely within the platform."
            },
            {
              question: "What if I receive a defective item?",
              answer: "EcoSwap does not verify item conditions. It is the responsibility of both parties to inspect and agree before finalizing a swap."
            },
            {
              question: "What happens if I have a dispute with another user?",
              answer: "EcoSwap does not mediate disputes. We encourage users to resolve issues amicably. If necessary, you may report a user to our support team."
            },
            {
              question: "How can I contact EcoSwap support?",
              answer: (
                <>
                  Email us at <strong>ecoswap@gmail.com</strong> or visit our{" "}
                  <a href="/support" className="text-green-600 hover:underline">
                    Support Page
                  </a>{" "}
                  for assistance.
                </>
              )
            }
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {index + 1}. {faq.question}
              </h3>
              <p className="text-gray-700 mt-2">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
