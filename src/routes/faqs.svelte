<script>
  import SvelteMarkdown from 'svelte-markdown';

  const source = `
  # FAQs

  ### OUR MANDATE

**Aerolink** is technologically designed to function as a streamlined, user-friendly platform in which clients can book a secure and comfortable ride from-and-to San Miguel de Allende in just a few minutes, enjoying a trustworthy and reliable service. Below are some of the Frequently Asked Questions (FAQs), hoping that they can assist in providing you with a smooth and seamless experience. For any additional questions please contact us at [contact@aerolink.app](mailto:contact@aerolink.app)

### RESERVATIONS

#### How do I make a reservation?

In order for us to best assist you, please make a reservation via our [website](https://www.aerolink.app/).

For the reservation process to run smoothly and efficiently, we strongly advise to reserve your ride with a minimum of 24 hours in advance of the time that you need to be picked up.

#### What is the soonest I can make a reservation?

To be able to provide you with a timely service, our platform enables you to book your trip until six hours before your scheduled departure time. In case you need an urgent ride within less than six hours please call or send a whatsapp to +52-415-138-27-35 and we will assess availability before being able to confirm your service.

### CHANGES/CANCELLATIONS

#### Can I cancel/change my reservation?

Clients can change or cancel their reservation up to 24 hours before the scheduled ride in order to be able to qualify for a full refund. Any bank transfer or credit card processing related fees will not be refunded. If a reservation is changed or cancelled less than 24 hours in advance of the scheduled pickup time, Aerolink will not provide a refund.

To cancel or change a reservation please send us an email at [contact@aerolink.app](mailto:contact@aerolink.app) or send a whatsapp or phone us to +52-415-138-27-35.

#### What happens if my flight/bus ride is delayed?

We are aware that delays might happen with both flights and ground transportation. This is why in the event of a delay in your flight or bus ride due to force majeure circumstances, Aerolink will not charge an additional fee and guarantee the ride at the new time of arrival. This is the **Aerolink Guarantee of Service.**

In case of a delay, we encourage our customers to notify their driver directly through WhatsApp or direct phone call. If you have trouble locating your driver please contact Aerolink at +52-415-138-27-35 or to [contact@aerolink.app](mailto:contact@aerolink.app)

### DRIVERS

#### Where are your drivers located?

All of our drivers are based at our operational hub of San Miguel de Allende. We also have contacts with local, on the ground driver networks in our different destinations, in order to be able to offer support in case of an unforeseen eventuality.

#### How do we ensure that the drivers are legitimate?

We take our reputation and the quality of our service very seriously, and we are aware of the impact that the service our drivers provide has on the overall user experience. Therefore, we have adopted driver verification processes that comply with the standards governing the top organisms in the private transportation field. Every driver registered with Aerolink has been officially approved as an Authorised Executive Transportation provider by the Government of Guanajuato, and we have not only screened them and verified their status accordingly but also tested their service personally to ensure that they comply with our quality standards. We also compile documents such as National ID, Driving License and Driving Record, No Criminal Records Certificate.

It is also important to note that every driver from Aerolink has approved rigorous psychometric evaluations. Our drivers have extended coverage car insurance, and our vehicles are no older than four years, undergoing mandatory mechanical inspections to ensure they are always circulating in proper conditions to guarantee the safety of our riders.

#### Is it possible to establish contact with our driver before our ride?

As part of our process, whenever a client books a ride through Aerolink, the client will receive a confirmation email with all the contact information corresponding to the driver: Name, Photo, Phone number, and Email, so that communication can flow smoothly in the case of any unforeseen circumstance. We encourage you to reach out to your driver directly to coordinate any specific arrangements (e.g. pick up gate, specific instructions on arrival, etc).

#### Where will my driver meet me if I am arriving to the airport?

As part of our service, our driver will Meet & Greet you at the airport arrivals hall with a board displaying your name.

#### Will my driver know if my flight is late?

Our logistics support team is constantly monitoring Flight Tracker to be able to observe delays or cancellations and ensure that the driver is up to date on the flight's arrival status. In the case of a bus ride, we highly advise you to keep your driver on the loop in case any potential delay to prevent any confusion that might affect the resulting service.

### CAPACITY PASSENGERS AND LUGGAGE

#### How many passengers can be on a ride?

Our current fleet of vehicles supports up to 4 passengers per ride. For large groups that require a special service, please send an email to [contact@aerolink.app](mailto:contact@aerolink.app) and we can certainly arrange something to fit your requirements.

#### How much baggage can I carry?

In order to maximize the capacity per ride, the baggage allowance per service varies depending on the number of passengers per ride. Please consult the following for more specific luggage allowance.

#### Can I carry special items? (Golf bags, videography equipment, etc)

While we strive to fulfill your baggage transportation needs, please note that not all our units could fit equipment that is larger than certain measures. If there is any specific, special equipment that you would like to take with you on your ride, please contact [contact@aerolink.app](mailto:contact@aerolink.app) with your query so that we can guarantee that the unit that serves you can accommodate your needs.

### PETS TRANSPORTATION POLICY

Passengers are allowed to bring pets in their ride with Aerolink as long as they are carried in their proper kennel - excluding service animals - and they must be included as a passenger when the reservation is requested by the customer. If there is any damage to the unit caused by the pet, the customer will be held liable for the damages that might ensue.

### ONLINE PAYMENT SECURITY STANDARDS

We take cyber security very seriously. In order to minimize the chance of a fraud through online payments, we adopt different standards such as an HTTP over SSL in order to guarantee the protection, privacy, and integrity of all data that passes through our website. We will handle payments through STRIPE, and we will not save nor handle sensitive information from our customers, such as credit or debit card numbers. This is achieved by using STRIPE as a secure payment gateway, where information goes directly to their API encrypted over SSL.

Our customers data will also remain confidential. In the case that a customer wants to create a user account to facilitate future reservations, an email confirmation link will be required. Customers are also advised to create a strong password combination.

### PRIVACY POLICY

We are firmly committed to protecting your privacy. Aerolink does not sell, trade, or rent your personal information to others. At some point in the future, we may use the information we collect to occasionally notify you about important functionality changes to our website, new Aerolink services, and special offers that we believe you will find of value. If you wish to opt out of this communication, please send us an email to [contact@aerolink.app](mailto:contact@aerolink.app) and we will delete your email from our internal database.
`;
</script>

<svelte:head>
  <title>FAQs | Aerolink</title>
</svelte:head>

<section class="my-10 mx-auto max-w-2xl px-3">
  <section class="prose lg:prose-xl">
    <SvelteMarkdown {source} />
  </section>
</section>
