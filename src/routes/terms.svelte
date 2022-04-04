<script>
  import SvelteMarkdown from 'svelte-markdown';

  const source = `
  # Terms and Conditions

  ### CANCELLATIONS

**You can change or cancel your reservation up to 24 hours** before the scheduled time in order to be able to qualify for a full refund. It is important to note that any bank transfer or credit card processing-related fees will not be refunded. **If a reservation is changed or cancelled less than 24 hours** in advance of the scheduled pickup time, no refund will be granted.

To cancel or change a reservation please send us an e-mail at [contact@aerolink.app](mailto:contact@aerolink.app) or send a whatsapp to +52-415-138-27-35 or +52-614-394-80-10 where we will be able to further assist you.

### SPECIAL CIRCUMSTANCES AND CONSIDERATIONS

#### Client's Acceptable Behavior

If the client places him/herself or the driver in a position of danger through inappropriate behavior, such as: verbal or physical abuse, refusal to provide payment, or inflicting damage on the vehicle in which the service is being provided, the driver has the right to cancel the service immediately. Cancellations caused by any or all of the aforementioned reasons will not be entitled to refund from Aerolink.

#### What happens if my flight gets cancelled?

In the unfortunate event your flight is cancelled by the airline, whatever the reason, we will waive the cancellation fee and guarantee the ride at the new time of arrival, as a part of the **Aerolink Guarantee of Service.

#### Mechanical Problems

Our entire fleet undergoes recurrent inspections in order to ensure it is fit to serve all of our commitments. Nevertheless, in the rare case that one of our vehicles experiences problems due to a mechanical failure or an accident, Aerolink will make alternate arrangements so that the trip can be completed.

#### Lost Items

Aerolink is not responsible for items that are lost or forgotten in its fleet of vehicles. However, we will do our best to recover anything that gets reported as left behind. In the case that this happens, we appreciate your cooperation by getting in touch with us promptly to report the incident so that we can track the belongings as soon as possible.

#### Children seats

Aerolink does not provide child seats. However, if needed, clients are welcome to bring their own child seats, but they must take full responsibility for both fitting the seat and the safety of the child. For pricing purposes, child seats will be charged the full adult fare.

#### Non-Smoking Policy

Smoking is strictly forbidden in all of the vehicles from Aerolink. Failure to comply with this rule will result in an immediate cancellation of service without any right to refund.

#### Force Majeure Events

The company is not responsible for any delays or additional costs to the client that are incurred by acts of war and/or terrorism, strikes, industrial action, weather inclemencies or political demonstrations that may take place in Mexico or throughout the world. During these times, the company reserves the right to alter pick-up times as they consider appropriate, always giving the passenger notice of any modification.

#### Late Arrivals

Aerolink will wait up to one hour after the scheduled pick-up time, or in the case of a delay, one hour after the flight has been confirmed as landed. If the client fails to show up after one hour, a waiting fee of $25.00 USD per hour will be charged. In the case of an extenuating circumstance preventing you to show up within this time frame, please get in touch with us so that we can consider a fee waiver based on your case.
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
