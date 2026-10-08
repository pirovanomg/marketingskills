// Built-in snippet library for Serenity Snippets.
// Format: { category, snippets: [[title, text], ...] }
// Titles must be unique across the whole library: each snippet's id is derived
// from its title, so favorites, recents, and shortcuts survive reordering.
// Text in [brackets] is a fill-in. {date} and {time} are replaced on copy.

var SNIPPET_LIBRARY = [
  {
    category: "Client Profile & Matching",
    snippets: [
      ["Prefers female caregiver", "Client has expressed a preference for a female caregiver."],
      ["Prefers male caregiver", "Client has expressed a preference for a male caregiver."],
      ["No caregiver gender preference", "Client has no preference regarding caregiver gender."],
      ["Non-smoking caregiver required", "Client requests a non-smoking caregiver. No smoking on the property, and caregivers should avoid smoke odor on clothing."],
      ["Smoker in the home", "There is a smoker in the home. Caregivers with smoke sensitivity or allergies may not be a good fit."],
      ["Dog in the home", "There is a dog in the home. Caregiver must be comfortable around dogs. Dog's name: [name]. Temperament: [friendly / protective / anxious]."],
      ["Cat in the home", "There is a cat in the home. Caregivers with cat allergies may not be a good fit."],
      ["No pets in the home", "There are no pets in the home."],
      ["Spanish-speaking caregiver preferred", "Client's primary language is Spanish. A bilingual (English/Spanish) caregiver is preferred."],
      ["Other language preferred", "Client's primary language is [language]. A caregiver who speaks [language] is preferred."],
      ["Hard of hearing", "Client is hard of hearing. Speak clearly, face the client, and minimize background noise. Client [does / does not] wear hearing aids."],
      ["Low vision", "Client has low vision. Keep walkways clear, keep items in their usual places, and announce yourself when entering a room."],
      ["Driving required", "Shifts include transportation. Caregiver must have a valid driver's license, a reliable insured vehicle, and a clean driving record."],
      ["No driving needed", "No transportation is required for this client's shifts."],
      ["Hands-on transfers required", "Client requires hands-on transfer assistance. Caregiver should be experienced with safe transfers and gait belt use."],
      ["Hoyer lift experience required", "Client uses a Hoyer (mechanical) lift. Caregiver must be trained and experienced with Hoyer lift transfers."],
      ["Dementia experience required", "Client has a diagnosis of dementia/Alzheimer's. Caregiver should have memory care experience and a calm, patient approach."],
      ["Calm, quiet caregiver preferred", "Client prefers a calm, soft-spoken caregiver and a quiet, low-key environment."],
      ["Social, talkative caregiver preferred", "Client is very social and enjoys conversation. A friendly, outgoing caregiver would be a great fit."],
      ["Shared hobbies are a plus", "Client enjoys [gardening, puzzles, music, card games]. Caregivers who share these interests are a plus."],
      ["Consistent caregiver needed", "Client does best with consistency. Please keep the same caregiver(s) on the schedule whenever possible."],
      ["Do not schedule caregiver", "Client/family has asked that [caregiver name] not be scheduled again. Reason: [reason]."],
      ["Fragrance sensitivity", "Client is sensitive to fragrances. Caregivers should avoid perfume, cologne, and scented lotions."],
      ["Religious or cultural considerations", "Client observes [religion / custom]. Please be respectful of [dietary practices / prayer times / holidays]."],
      ["Stairs in the home", "The home has stairs [at the entrance / inside]. Caregiver must be able to navigate stairs safely and assist the client on stairs."],
      ["Parking and entry", "Parking: [details]. Entry: [front door / side door / lockbox]. Lockbox and door codes are on file with the office. Do not record codes in notes."],
      ["Experienced caregiver needed", "Client's care needs are complex. Please schedule an experienced caregiver."],
      ["Strong cooking skills preferred", "Client would like a caregiver who is comfortable cooking full meals from scratch."],
      ["Housekeeping expectations", "Client expects light housekeeping each visit: [dishes, laundry, tidying, trash]. Caregiver should be comfortable with these tasks."]
    ]
  },
  {
    category: "Preferences & Routine",
    snippets: [
      ["Preferred name", "Client prefers to be called [name]."],
      ["Morning routine", "Client's preferred morning routine: [wake time, coffee/breakfast, shower, dressing]."],
      ["Bedtime routine", "Client's preferred bedtime routine: [time, evening snack, night clothes, lights/TV]."],
      ["Food likes and dislikes", "Client enjoys [foods] and dislikes [foods]."],
      ["Favorite shows and music", "Client enjoys watching [shows] and listening to [music/radio station]."],
      ["Values independence", "Client likes to do as much as possible independently. Offer help without taking over, and allow extra time."],
      ["Prefers bathing in the evening", "Client prefers to bathe in the evening rather than the morning."],
      ["Likes a set schedule", "Client is most comfortable when the day follows the same schedule. Avoid unexpected changes where possible."],
      ["Topics to avoid", "Client becomes upset when discussing [topic]. Please avoid this topic and redirect if it comes up."],
      ["Things that comfort client", "Client is comforted by [music, a favorite blanket, looking at photos, a cup of tea]."]
    ]
  },
  {
    category: "Arrival & Start of Visit",
    snippets: [
      ["Arrived on time", "Arrived on time and clocked in at {time}. Greeted client, who was [awake / resting] and [in good spirits]."],
      ["Arrived late", "Arrived [__] minutes late due to [traffic / prior shift / other]. Office was notified."],
      ["Client resting on arrival", "Client was resting on arrival. Allowed client to rest and began household tasks quietly."],
      ["Family present on arrival", "Family member [name] was present at the start of the visit and shared the following update: [update]."],
      ["Client did not answer door", "Arrived for scheduled visit; client did not answer the door. Called client and the office at {time}. Waited [__] minutes per office instructions."],
      ["Client declined visit", "Client declined services today. Caregiver respected the client's wishes and notified the office at {time}."],
      ["Home clean and safe on arrival", "Home was clean and safe on arrival. No hazards noted."],
      ["Hazard found on arrival", "On arrival, noticed [hazard, e.g. spill, stove left on, door unlocked]. Addressed it by [action] and notified the office."]
    ]
  },
  {
    category: "Visit Summary & Departure",
    snippets: [
      ["Uneventful shift", "Uneventful shift. Client was comfortable, all scheduled tasks were completed, and there are no concerns to report."],
      ["All care plan tasks completed", "All tasks on the care plan were completed as scheduled."],
      ["Some tasks not completed", "The following care plan tasks were not completed: [task]. Reason: [client declined / ran out of time / supplies unavailable]."],
      ["Client left safe and comfortable", "At the end of the shift, client was left safe and comfortable [in recliner / in bed] with phone, water, and call button within reach."],
      ["Handed off to family", "Care was handed off to [family member / next caregiver] at {time}. Updated them on today's visit."],
      ["Home secured on departure", "Doors were locked and the home was secured on departure."],
      ["Left early with approval", "Left [__] minutes early at the client's request. Office was notified and approved."],
      ["Shift extended", "Shift was extended by [__] minutes due to [reason]. Office was notified and approved."],
      ["Daily summary", "Visit summary for {date}: [personal care], [meals], [activities], [housekeeping]. Client's mood was [mood]. No concerns."]
    ]
  },
  {
    category: "Personal Care",
    snippets: [
      ["Shower assistance", "Assisted client with a shower using the shower chair. Client tolerated it well. Skin checked; no redness or breakdown observed."],
      ["Bed bath", "Provided a bed bath. Client tolerated it well. Skin checked; no redness or breakdown observed."],
      ["Sponge bath", "Assisted client with a sponge bath at the sink."],
      ["Bathing declined", "Client declined bathing today. Offered again later in the shift; client still declined. Will offer again next visit."],
      ["Grooming", "Assisted with grooming, including hair care, oral care, and shaving."],
      ["Oral care and dentures", "Assisted with oral care. Dentures cleaned and [stored in case / placed in client's mouth]."],
      ["Dressing assistance", "Assisted client with dressing in clean, weather-appropriate clothes."],
      ["Toileting assistance", "Assisted with toileting [__] times during the shift."],
      ["Incontinence care", "Provided incontinence care and changed brief [__] times. Perineal care completed; skin intact."],
      ["Bowel movement", "Client had a bowel movement during the shift. Consistency: [normal / loose / hard]."],
      ["No bowel movement", "Client reports no bowel movement in [__] days. Family/office notified."],
      ["Nail care", "Filed and cleaned fingernails. Toenail and diabetic nail care not performed per policy."],
      ["Lotion applied", "Applied lotion to dry skin on [arms / legs / back]."],
      ["Skin redness noted", "Noticed redness on [location], approximately [size]. Skin was not broken. Reported to office/family."],
      ["Hair washed", "Washed and dried client's hair."]
    ]
  },
  {
    category: "Mobility & Fall Prevention",
    snippets: [
      ["Walked with walker", "Client walked with walker and standby assistance. Steady gait observed."],
      ["Walked with cane", "Client walked with cane and standby assistance. Steady gait observed."],
      ["Wheelchair mobility", "Client used wheelchair for mobility. Assisted with positioning and moving between rooms."],
      ["Transfer assistance", "Assisted client with transfers [bed to chair / chair to toilet] using gait belt. Transfers completed safely."],
      ["Repositioned in bed", "Repositioned client every 2 hours while in bed to help prevent pressure areas."],
      ["Encouraged exercise", "Encouraged client to complete prescribed exercises and walking. Client walked [__ minutes / to the mailbox]."],
      ["More unsteady than usual", "Client appeared more unsteady than usual today. Provided close standby assistance with all walking. Office notified."],
      ["Near fall", "Client lost balance at {time} while [activity]. Caregiver assisted and the client did not fall. No injury. Office notified."],
      ["Fall occurred", "Client fell at {time} in the [location]. Client [was / was not] injured. Caregiver [called 911 / did not lift client and called the office]. Office and family notified. Incident report to follow."],
      ["Removed tripping hazards", "Removed tripping hazards (rugs, cords, clutter) from walkways."],
      ["Fall risk", "Client is a fall risk. Standby assistance required for all walking and transfers."],
      ["Keep mobility aid in reach", "Client uses a [cane / walker / wheelchair]. Keep the mobility aid within reach at all times."]
    ]
  },
  {
    category: "Meals & Hydration",
    snippets: [
      ["Breakfast served", "Prepared and served breakfast: [meal]. Client ate [all / about half / very little]."],
      ["Lunch served", "Prepared and served lunch: [meal]. Client ate [all / about half / very little]."],
      ["Dinner served", "Prepared and served dinner: [meal]. Client ate [all / about half / very little]."],
      ["Snack served", "Offered a snack: [snack]. Client ate [all / some / none]."],
      ["Good appetite", "Client had a good appetite today and finished meals."],
      ["Poor appetite", "Client had a poor appetite today, eating less than half of meals. Encouraged fluids and offered alternatives."],
      ["Fluids encouraged", "Encouraged fluids throughout the shift. Client drank approximately [__] cups."],
      ["Special diet followed", "Followed client's [diabetic / low-sodium / soft / pureed] diet."],
      ["Feeding assistance", "Assisted client with eating. Client ate [amount] at a comfortable pace."],
      ["Meals prepped for later", "Prepared meals for later, labeled them with the date, and stored them in the refrigerator."],
      ["Expired food discarded", "Checked the refrigerator and discarded expired food."],
      ["Grocery list started", "Started a grocery list for family: [items]."],
      ["Difficulty swallowing", "Client coughed or had difficulty swallowing during the meal. Slowed pace and kept client upright. Reported to office."],
      ["Food allergy", "Client is allergic to [food]. Do not prepare or serve."]
    ]
  },
  {
    category: "Medication Reminders",
    snippets: [
      ["Reminder given, taken", "Reminded client to take scheduled medications at {time}. Client took medications from the pre-filled organizer."],
      ["Reminder given, declined", "Client declined medications after reminder at {time}. Office/family notified."],
      ["Pill organizer running low", "Pill organizer is [empty / running low] for [day]. Family/office notified for refill."],
      ["Missed dose found", "Found [morning / evening] medications still in the organizer from [day]. Did not give. Office/family notified."],
      ["Prescription picked up", "Picked up prescription(s) from [pharmacy] at client's request."],
      ["Reminders only", "Medication reminders only. Caregiver did not administer medication."]
    ]
  },
  {
    category: "Health Observations",
    snippets: [
      ["No change in condition", "No changes in condition observed today."],
      ["Pain reported", "Client reported pain in [location], rated [__]/10. Reported to office/family."],
      ["More confused than usual", "Client seemed more confused than usual today: [details]. Office notified."],
      ["More tired than usual", "Client seemed more tired than usual and slept much of the shift."],
      ["Short of breath", "Client appeared short of breath during [activity]. Rested and symptoms [improved / did not improve]. Office notified."],
      ["Swelling noted", "Noticed swelling in [ankles / feet / legs]. Reported to office/family."],
      ["Cold symptoms", "Client has [cough / runny nose / sore throat]. Encouraged fluids and rest. Office notified."],
      ["Temperature taken", "Client felt warm. Temperature taken at {time}: [__]°F. Reported to office/family."],
      ["Vitals recorded", "Vitals per care plan: BP [__/__], pulse [__], temp [__]°F."],
      ["Dizziness", "Client reported feeling dizzy at {time} while [activity]. Sat client down until it passed. Office notified."],
      ["Poor sleep reported", "Client reports sleeping poorly last night."],
      ["Possible UTI signs", "Client reports [burning / frequent urination], or urine appeared [dark / cloudy / strong-smelling]. Reported to office as possible UTI signs."],
      ["Bruise noticed", "Noticed a bruise on [location]. Client [states it was from ___ / is unsure of the cause]. Reported to office."],
      ["Upcoming appointment", "Client has an upcoming appointment with [provider] on [date] at [time]."],
      ["Called 911", "Called 911 at {time} due to [reason]. Client was transported to [hospital]. Office and family notified."]
    ]
  },
  {
    category: "Mood & Behavior",
    snippets: [
      ["Good spirits", "Client was in good spirits, alert, and engaged in conversation."],
      ["Pleasant and cooperative", "Client was pleasant and cooperative with all care today."],
      ["Low mood", "Client seemed down and withdrawn today. Offered conversation and activities. Will continue to monitor."],
      ["Anxious", "Client seemed anxious today about [topic]. Offered reassurance, and client [settled / remained anxious]."],
      ["Agitated, redirected", "Client became agitated at {time} when [trigger]. Redirected with [approach]; client calmed after [__] minutes."],
      ["Sundowning", "Client showed increased confusion and restlessness in the late afternoon/evening. Kept the environment calm and the lights on."],
      ["Wandering or exit-seeking", "Client attempted to leave the home at {time}. Caregiver redirected safely. Office notified."],
      ["Repetitive questions", "Client asked repetitive questions throughout the shift. Responded calmly and redirected."],
      ["Alert and oriented", "Client was alert and oriented to person, place, and time."],
      ["Seeing or hearing things", "Client reported seeing/hearing [details] that were not present. Stayed calm, reassured client, and reported to office."],
      ["Resisted care", "Client resisted care during [task]. Stopped, gave client time, and tried again later [successfully / unsuccessfully]."],
      ["Feeling lonely", "Client mentioned feeling lonely. Spent extra time in conversation."]
    ]
  },
  {
    category: "Companionship & Activities",
    snippets: [
      ["Conversation", "Spent time in conversation with client about [topics]."],
      ["Walk outside", "Went for a walk outside with client for [__] minutes. Client enjoyed the fresh air."],
      ["Games and puzzles", "Played [cards / board game / puzzle] with client."],
      ["Music", "Listened to music with client. Client [sang along / enjoyed it]."],
      ["Reading or TV", "Read with client / watched [show] together."],
      ["Call with family", "Helped client make a phone/video call with [name]."],
      ["Reminiscing", "Looked through photo albums and reminisced with client."],
      ["Outing", "Accompanied client on an outing to [place]."],
      ["Arts and crafts", "Worked on [craft / coloring / knitting] with client."]
    ]
  },
  {
    category: "Housekeeping & Errands",
    snippets: [
      ["Light housekeeping", "Completed light housekeeping: dishes, wiped counters, tidied living areas, and took out the trash."],
      ["Laundry", "Washed, dried, folded, and put away client's laundry."],
      ["Changed bed linens", "Changed client's bed linens."],
      ["Bathroom cleaned", "Cleaned the bathroom: sink, toilet, and tub/shower."],
      ["Floors swept or vacuumed", "Swept/vacuumed the [living room / kitchen / bedroom]."],
      ["Kitchen cleaned", "Cleaned the kitchen, including dishes, counters, and stovetop."],
      ["Grocery shopping", "Went grocery shopping [with / for] client. Receipt and change ($[__]) given to client."],
      ["Errands", "Ran errands for client: [errands]."],
      ["Transported to appointment", "Transported client to [appointment] at [location]. Departed [time], returned [time]. Mileage: [__]."],
      ["Supplies running low", "Client is running low on [gloves / briefs / wipes / soap]. Family/office notified."]
    ]
  },
  {
    category: "Communication",
    snippets: [
      ["Called the office", "Called the office at {time} regarding [topic]. Spoke with [name]."],
      ["Family updated", "Updated [family member] on today's visit."],
      ["Family request", "Family requested [task / change]. Passed along to the office."],
      ["Schedule change requested", "Client requested a schedule change: [details]. Referred to the office."],
      ["Care plan review recommended", "Client's needs appear to have changed. Recommend a care plan review regarding [area]."],
      ["Note for next caregiver", "Note for next caregiver: [details]."],
      ["New doctor's instructions", "Family/client shared new instructions from [doctor]: [details]."],
      ["Home from hospital", "Client returned home from [hospital / rehab] on [date]. Discharge instructions: [details]."]
    ]
  },
  {
    category: "Safety & Incidents",
    snippets: [
      ["Safety concern", "Safety concern observed: [details]. Reported to office."],
      ["Equipment not working", "[Equipment] is not working properly. Reported to office/family."],
      ["Unfamiliar visitor", "An unfamiliar visitor, [name / description], came to the home at {time}. [Details]."],
      ["Possible abuse or neglect", "Observed [details], which may indicate a concern for the client's well-being. Reported to supervisor immediately per agency policy."],
      ["Possible scam", "Client received a suspicious [phone call / letter / email] asking for money or personal information. Advised client not to share information; notified family/office."],
      ["Power outage or weather", "[Power outage / severe weather] during the shift. Client kept safe and comfortable. Office notified."],
      ["Home too hot or cold", "Home temperature was [too hot / too cold] (approximately [__]°F). [Adjusted thermostat / notified family]."],
      ["Caregiver injury", "Caregiver sustained a minor injury at {time} while [activity]. Supervisor notified."],
      ["Illness in the home", "Client/household member reported illness ([symptoms]). Used PPE and notified office."]
    ]
  }
];

if (typeof module !== "undefined") module.exports = { SNIPPET_LIBRARY: SNIPPET_LIBRARY };
