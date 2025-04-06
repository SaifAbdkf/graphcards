// import OpenAI from "openai";
// import { appendFile } from "fs";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// async function AI_action(model, notes, system, user) {
//   const completion = await openai.chat.completions.create({
//     model: model,
//     messages: [
//       { role: "system", content: `${system}` },
//       {
//         role: "user",
//         content: `${user}`,
//       },
//     ],
//     store: true,
//   });

//   console.log("===========================");
//   console.log(completion.choices);
//   console.log(completion.choices[0].message);

//   const logRow = [
//     model,
//     notes,
//     system,
//     user,
//     completion.choices[0].message.content,
//     completion.usage?.prompt_tokens,
//     completion.usage?.completion_tokens,
//     completion.usage?.total_tokens,
//     "<X>",
//   ];

//   addRowToLog(logRow);
// }

// function addRowToLog(rowArr) {
//   const newRow = rowArr.join(";") + "\n";
//   appendFile("ai_logs.csv", newRow, (err) => {
//     if (err) {
//       console.error("Error appending to CSV:", err);
//     } else {
//       console.log("log added successfully!");
//     }
//   });
// }

// const my_terms = [];
// const test_terms = ["شنوّا أحوالك", "يدّك فالزّبّي", "قريب من"];

// function request_params_object(term) {
//   return {
//     notes: "first baseline try",
//     system:
//       "You are a language expert helping the user to learn about new words in tunisian. translate the word or expression surrounded by-- from tunisian to english",
//     user: `--${term}--`,
//   };
// }

// export function run_eval_round() {
//   for (const test_term of test_terms) {
//     const request_params = request_params_object(test_term);
//     AI_action(
//       "gpt-4o-mini",
//       request_params.notes,
//       request_params.system,
//       request_params.user
//     );
//   }
// }
