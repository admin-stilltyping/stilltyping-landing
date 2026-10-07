export interface PageMetadata {
  path: string
  title: string
  description: string
}

export interface ProductGuide extends PageMetadata {
  label: string
  heading: string
  intro: string
  example: { question: string; answer: string; note: string }
  sections: { id: string; heading: string; paragraphs: string[]; items?: string[] }[]
  steps: string[]
  faqs: { question: string; answer: string }[]
}

export const homeMetadata: PageMetadata = {
  path: '/',
  title: 'AI Customer Support & Website Chatbot | stilltyping',
  description: 'Give customers an AI assistant that uses your business knowledge. Add website chat, capture enquiries, and create support tickets with stilltyping.',
}

export const guides: ProductGuide[] = [
  {
    path: '/ai-customer-support',
    label: 'AI customer support',
    title: 'AI Customer Support for Small Businesses | stilltyping',
    description: 'Answer customer questions using your own business knowledge and instructions. Create support tickets for questions that need your team with stilltyping.',
    heading: 'Customer support starts with what your business knows.',
    intro: 'Give your AI assistant the information your team uses every day: opening hours, service details, delivery policies, and answers to common questions. stilltyping brings that knowledge into customer conversations.',
    example: {
      question: 'Can I return an item bought last week?',
      answer: 'Unopened items can be returned within 14 days with your receipt. Bring the item to our store and the team can help.',
      note: 'Illustrative reply based on a sample return policy. Your answers depend on the knowledge you provide.',
    },
    sections: [
      {
        id: 'business-knowledge', heading: 'A knowledge base you can maintain',
        paragraphs: [
          'Add and update your business information in the Knowledge Base. The assistant retrieves relevant information when a customer asks a question, so a store can explain its return policy and a service business can explain how an appointment works.',
          'Keep policies specific and current. Include the details a customer needs to make a decision, such as opening hours, location, eligibility, and what to do next. Review answers after changing your knowledge.',
        ],
      },
      {
        id: 'instructions', heading: 'Set the way your assistant should help',
        paragraphs: ['AI Instructions let you describe your business’s preferred tone and guidance. Use them to explain what to ask before proceeding and when a request needs your team. Try representative questions in Agent Chat before sharing the assistant with customers.'],
        items: ['Check everyday questions and short follow-up messages.', 'Try questions where the answer is missing or unclear.', 'Review the response and improve the knowledge or instructions.'],
      },
      {
        id: 'human-support', heading: 'Give unresolved questions a human next step',
        paragraphs: [
          'When the assistant cannot support an answer with the available information, it can create a support ticket if Support Tickets is enabled. The customer receives a reference, and your team can review the question, add notes, and resolve it in the business portal.',
          'A ticket is a request for your team to follow up. It does not mean a live agent has joined the conversation or guarantee a response time. Keep your customer-facing support expectations clear.',
        ],
      },
    ],
    steps: ['Request a business workspace and the features you need.', 'After approval, add your knowledge and assistant instructions.', 'Test customer questions, then share your website chat link or widget.'],
    faqs: [
      { question: 'Does it automatically know everything about my business?', answer: 'No. You supply and maintain the business knowledge and instructions. The assistant uses that information and the tools available to your workspace.' },
      { question: 'Can my team review questions that need help?', answer: 'Yes. With Support Tickets enabled, your team can review created tickets, update their notes, and mark them resolved in the portal.' },
      { question: 'Is signup instant access?', answer: 'You request an account and the modules you need. A platform administrator reviews the request before you start using your approved workspace.' },
    ],
  },
  {
    path: '/website-chatbot',
    label: 'Website chatbot',
    title: 'Website Chatbot with Your Business Knowledge | stilltyping',
    description: 'Add an AI chat widget or share a public chat link. Answer visitor questions using business knowledge and capture enquiries with stilltyping website chat.',
    heading: 'Give website visitors a place to ask.',
    intro: 'Add a chat widget to your website or share your business’s public chat link. Visitors can ask about your business without signing in to your management portal.',
    example: {
      question: 'What time do you open on Saturday?',
      answer: 'We open from 10 am to 7 pm on Saturdays. You can find us at 24 Garden Street.',
      note: 'Sample business information. The live assistant uses the knowledge saved for your business.',
    },
    sections: [
      {
        id: 'installation', heading: 'Choose a widget or a direct link',
        paragraphs: [
          'Open Integrations → Web Chat in your business portal to find your chat link and the website embed script. Share the link with customers, or have your website maintainer add the script to the pages where visitors need help.',
          'The widget opens from a launcher in the corner of the website. The conversation loads when a visitor opens it, and closing the widget keeps the conversation available when they return to it.',
        ],
      },
      {
        id: 'context', heading: 'Use the same business knowledge in every reply',
        paragraphs: ['Website chat uses your saved business information and assistant instructions. Start with the questions visitors ask before they contact you: where you are, what services you offer, how your policies work, and how to take the next step.'],
        items: ['Maintain answers in the business Knowledge Base.', 'Preview responses with Agent Chat.', 'Check the widget on your actual website on mobile and desktop.'],
      },
      {
        id: 'enquiries', heading: 'Keep enquiries available for follow-up',
        paragraphs: [
          'With Leads enabled, incoming website messages are saved as enquiries. Your team can review the question history in the portal. An anonymous visitor can begin a conversation without immediately becoming a customer record.',
          'Visitors have their own chat sessions. Conversation history can be restored in the same browser while its saved session is available; starting a new chat or clearing browser storage starts a new session. Unresolved questions can create support tickets when that feature is enabled.',
        ],
      },
    ],
    steps: ['Add your business knowledge and test the assistant.', 'Copy the chat link or embed script from Integrations → Web Chat.', 'Open the live widget and check a complete visitor conversation.'],
    faqs: [
      { question: 'Do customers need a stilltyping account?', answer: 'No. Public website chat creates a visitor session. Your business portal remains a separate sign-in for managing the workspace.' },
      { question: 'Can I use a link before adding a widget?', answer: 'Yes. Your business has a public chat link you can share directly. The widget is another way to open that chat from your website.' },
      { question: 'Does every conversation create a customer?', answer: 'No. With Leads enabled, messages are enquiries. A customer record is created or matched when an order or appointment is saved with the required contact details.' },
    ],
  },
  {
    path: '/appointment-booking',
    label: 'Appointment requests',
    title: 'AI Appointment Requests with Staff Confirmation | stilltyping',
    description: 'Let customers request appointments through chat. Collect service, contact, and preferred time details, then review and confirm requests in the stilltyping portal.',
    heading: 'From a conversation to an appointment request.',
    intro: 'Let your assistant collect the details for an appointment while your team keeps control of confirmation. Requests appear in the business portal for staff to review.',
    example: {
      question: 'Can I request a consultation for Friday at 10 am?',
      answer: 'I can help with an appointment request. Please share your name, what the consultation is for, and your phone number with country code.',
      note: 'Illustrative conversation. A saved request is scheduled pending staff confirmation; a chat reply alone does not reserve a slot.',
    },
    sections: [
      {
        id: 'services', heading: 'Start with the services you actually offer',
        paragraphs: [
          'Enable Services and Appointments together with Customers, then add the active services customers can request. Set each service’s name, description, price, and duration in the portal. The assistant looks up that catalog before saving a request.',
          'Keep your business timezone and opening-hour instructions accurate. The assistant interprets requested dates and times in that timezone and asks for clarification when details are incomplete.',
        ],
      },
      {
        id: 'request-details', heading: 'Collect the details in the conversation',
        paragraphs: ['When a customer explicitly asks to book, the assistant collects the service, name, reason for the visit, preferred date and time, and the contact details needed to identify the request. Website chat asks for a phone number with country code.'],
        items: ['The service must exist and be active in your catalog.', 'The customer must provide the required booking details.', 'A successful save creates an appointment the team can see in the portal.'],
      },
      {
        id: 'confirmation', heading: 'Your team confirms the appointment',
        paragraphs: [
          'A saved appointment starts as Scheduled and waits for staff confirmation. Your team can review it, confirm it, reschedule it, or cancel it in the portal. With Leads enabled, the saved appointment can also connect the enquiry to a customer record.',
          'stilltyping does not check a live staff calendar or reserve an exclusive slot. Review availability before confirming. Changes to an existing appointment are handled by your team in the portal.',
        ],
      },
    ],
    steps: ['Request Services and Appointments with Customers for your workspace.', 'Configure services, your business timezone, and booking instructions.', 'Test a request, then review and confirm it from the Appointments page.'],
    faqs: [
      { question: 'Is an appointment automatically confirmed?', answer: 'No. A successful chat booking creates a Scheduled appointment pending staff confirmation. Your team reviews availability before confirming it.' },
      { question: 'Does it check a live calendar for free slots?', answer: 'No. The current booking flow saves a preferred time and does not reserve staff or resources. Your team checks availability.' },
      { question: 'Can a customer reschedule through the assistant?', answer: 'Staff handle rescheduling and cancellation in the portal. The assistant should direct a change request to the team rather than create another booking.' },
    ],
  },
]

export const notFoundMetadata: PageMetadata = {
  path: '/404', title: 'Page not found | stilltyping',
  description: 'This page could not be found. Explore stilltyping customer support, website chat, and appointment requests.',
}

export const publicPages: PageMetadata[] = [homeMetadata, ...guides]
