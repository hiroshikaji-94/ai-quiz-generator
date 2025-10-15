/**
 * Generate 5 USA-themed quizzes with real questions
 * Run with: node scripts/generate-usa-quizzes.js
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zwqgqktijusoyxgkqgqb.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cWdxa3RpanVzb3l4Z2txZ3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NTU4MzQsImV4cCI6MjA3NjAzMTgzNH0.74hdm-D2r046Jjx5LRl54keH_Aty2KoU7kh5aOfOCeA';

const supabase = createClient(supabaseUrl, supabaseKey);

// Real quiz questions about common USA topics
const usaQuizzes = [
  {
    title: "USA State Capitals Quiz",
    outline: "A 5 question quiz about US state capitals and geography",
    questions: [
      {
        question: "What is the capital of California?",
        options: ["Los Angeles", "San Francisco", "Sacramento", "San Diego"],
        correct: 2,
        explanation: "Sacramento has been California's capital since 1854, chosen for its central location."
      },
      {
        question: "Which city is the capital of New York state?",
        options: ["New York City", "Buffalo", "Albany", "Rochester"],
        correct: 2,
        explanation: "Albany became New York's capital in 1797. Many people mistakenly think it's New York City!"
      },
      {
        question: "What is the capital of Texas?",
        options: ["Houston", "Dallas", "Austin", "San Antonio"],
        correct: 2,
        explanation: "Austin has been Texas's capital since 1839 and is known for its music scene."
      },
      {
        question: "Which city serves as the capital of Illinois?",
        options: ["Chicago", "Springfield", "Peoria", "Rockford"],
        correct: 1,
        explanation: "Springfield became Illinois's capital in 1837. It's also Abraham Lincoln's hometown!"
      },
      {
        question: "What is the capital of Washington state?",
        options: ["Seattle", "Spokane", "Olympia", "Tacoma"],
        correct: 2,
        explanation: "Olympia has been Washington's capital since 1853, located at the southern end of Puget Sound."
      }
    ]
  },
  {
    title: "American National Parks Quiz",
    outline: "A 5 question quiz about famous US National Parks",
    questions: [
      {
        question: "Which national park is famous for its massive sequoia trees?",
        options: ["Yosemite", "Sequoia National Park", "Redwood", "Olympic"],
        correct: 1,
        explanation: "Sequoia National Park in California is home to giant sequoia trees, including General Sherman, the world's largest tree by volume!"
      },
      {
        question: "In which state is Yellowstone National Park primarily located?",
        options: ["Montana", "Idaho", "Wyoming", "Colorado"],
        correct: 2,
        explanation: "While Yellowstone extends into Montana and Idaho, about 96% of it is in Wyoming. It was the first national park in the world!"
      },
      {
        question: "What is the Grand Canyon's main feature?",
        options: ["A volcano", "A deep river gorge", "A mountain range", "A desert lake"],
        correct: 1,
        explanation: "The Grand Canyon is a massive gorge carved by the Colorado River over millions of years, reaching depths of over one mile!"
      },
      {
        question: "Which national park is known for its diverse wildlife including grizzly bears?",
        options: ["Death Valley", "Glacier National Park", "Zion", "Arches"],
        correct: 1,
        explanation: "Glacier National Park in Montana is home to grizzly bears, mountain goats, and over 70 other mammal species."
      },
      {
        question: "In which state would you find Acadia National Park?",
        options: ["Maine", "Vermont", "New Hampshire", "Massachusetts"],
        correct: 0,
        explanation: "Acadia National Park is located on Mount Desert Island in Maine, featuring beautiful rocky coastlines and mountains."
      }
    ]
  },
  {
    title: "USA Holidays and Traditions Quiz",
    outline: "A 5 question quiz about American holidays and cultural traditions",
    questions: [
      {
        question: "On which date is Independence Day celebrated in the USA?",
        options: ["July 1st", "July 4th", "June 14th", "August 15th"],
        correct: 1,
        explanation: "July 4th celebrates the adoption of the Declaration of Independence in 1776, marking America's freedom from Britain."
      },
      {
        question: "What do Americans traditionally eat on Thanksgiving?",
        options: ["Hot dogs", "Turkey", "Pizza", "Tacos"],
        correct: 1,
        explanation: "Turkey is the traditional centerpiece of Thanksgiving dinner, along with stuffing, cranberry sauce, and pumpkin pie!"
      },
      {
        question: "Which president's birthday is celebrated as Presidents' Day?",
        options: ["Only George Washington", "Only Abraham Lincoln", "Both Washington and Lincoln", "All presidents"],
        correct: 2,
        explanation: "Presidents' Day honors both George Washington (Feb 22) and Abraham Lincoln (Feb 12), falling on the third Monday in February."
      },
      {
        question: "What do children traditionally do on Halloween?",
        options: ["Trick-or-treating", "Easter egg hunting", "Fireworks", "Caroling"],
        correct: 0,
        explanation: "Trick-or-treating is when children dress up in costumes and go door-to-door collecting candy on Halloween night!"
      },
      {
        question: "When is Memorial Day observed?",
        options: ["First Monday in September", "Last Monday in May", "Fourth of July", "November 11th"],
        correct: 1,
        explanation: "Memorial Day is observed on the last Monday in May to honor military personnel who died serving the country."
      }
    ]
  },
  {
    title: "American Sports Quiz",
    outline: "A 5 question quiz about popular sports in America",
    questions: [
      {
        question: "What is America's national pastime sport?",
        options: ["Football", "Basketball", "Baseball", "Hockey"],
        correct: 2,
        explanation: "Baseball is often called America's national pastime, with a rich history dating back to the 1800s!"
      },
      {
        question: "How many players are on a basketball team on the court at once?",
        options: ["4", "5", "6", "7"],
        correct: 1,
        explanation: "Five players from each team play on the court at the same time in basketball."
      },
      {
        question: "What is the championship game of American football called?",
        options: ["World Series", "NBA Finals", "Super Bowl", "Stanley Cup"],
        correct: 2,
        explanation: "The Super Bowl is the NFL's championship game, one of the most-watched sporting events in America!"
      },
      {
        question: "In which sport do you score a 'touchdown'?",
        options: ["Baseball", "Football", "Basketball", "Soccer"],
        correct: 1,
        explanation: "A touchdown is worth 6 points in American football, scored when a team carries or catches the ball in the end zone."
      },
      {
        question: "How many strikes do you get before you're out in baseball?",
        options: ["2", "3", "4", "5"],
        correct: 1,
        explanation: "In baseball, three strikes mean you're out! Batters try to hit the ball before getting three strikes."
      }
    ]
  },
  {
    title: "Famous US Landmarks Quiz",
    outline: "A 5 question quiz about iconic American landmarks and monuments",
    questions: [
      {
        question: "In which city is the Statue of Liberty located?",
        options: ["Boston", "Philadelphia", "New York City", "Washington DC"],
        correct: 2,
        explanation: "The Statue of Liberty stands in New York Harbor, gifted by France in 1886 as a symbol of freedom."
      },
      {
        question: "What are the four presidents carved into Mount Rushmore?",
        options: ["Washington, Jefferson, Lincoln, Kennedy", "Washington, Jefferson, Lincoln, Roosevelt", "Washington, Adams, Lincoln, Roosevelt", "Jefferson, Madison, Lincoln, Roosevelt"],
        correct: 1,
        explanation: "Mount Rushmore features George Washington, Thomas Jefferson, Theodore Roosevelt, and Abraham Lincoln!"
      },
      {
        question: "Where is the Liberty Bell located?",
        options: ["New York", "Boston", "Philadelphia", "Baltimore"],
        correct: 2,
        explanation: "The Liberty Bell is in Philadelphia, Pennsylvania. It's famous for its crack and symbolizes American independence."
      },
      {
        question: "What famous bridge is in San Francisco?",
        options: ["Brooklyn Bridge", "Golden Gate Bridge", "London Bridge", "Bay Bridge"],
        correct: 1,
        explanation: "The Golden Gate Bridge, with its distinctive orange color, has spanned San Francisco Bay since 1937!"
      },
      {
        question: "In which state can you find the Gateway Arch?",
        options: ["Illinois", "Missouri", "Kansas", "Nebraska"],
        correct: 1,
        explanation: "The Gateway Arch is in St. Louis, Missouri, standing 630 feet tall as a symbol of westward expansion."
      }
    ]
  }
];

async function generateAndSaveQuiz(quizData, index) {
  console.log(`\n📝 [${index + 1}/5] Creating: ${quizData.title}`);
  
  try {
    const { data: lesson, error: insertError } = await supabase
      .from('lessons')
      .insert({
        title: quizData.title,
        outline: quizData.outline,
        status: 'generated',
        questions: quizData.questions,
      })
      .select()
      .single();

    if (insertError) {
      console.error(`   ❌ Error: ${insertError.message}`);
      return null;
    }

    console.log(`   ✅ Success! Created with ${quizData.questions.length} questions`);
    console.log(`   📚 Topics covered:`);
    quizData.questions.forEach((q, i) => {
      console.log(`      ${i + 1}. ${q.question.substring(0, 50)}...`);
    });
    return lesson;
    
  } catch (error) {
    console.error(`   ❌ Error:`, error.message);
    return null;
  }
}

async function main() {
  console.log('\n🇺🇸 Generating 5 USA-Themed Quizzes');
  console.log('═══════════════════════════════════════════════\n');
  console.log('Creating quizzes about:');
  usaQuizzes.forEach((quiz, i) => {
    console.log(`  ${i + 1}. ${quiz.title}`);
  });
  console.log('');

  const results = [];
  
  for (let i = 0; i < usaQuizzes.length; i++) {
    const result = await generateAndSaveQuiz(usaQuizzes[i], i);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  const successful = results.filter(r => r !== null).length;
  
  console.log('\n═══════════════════════════════════════════════');
  console.log(`\n✅ Complete! ${successful}/${usaQuizzes.length} quizzes created\n`);
  
  if (successful > 0) {
    console.log('🎉 View your quizzes at: http://localhost:3000\n');
  }
  
  const { count } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true });
  
  console.log(`📊 Total quizzes in database: ${count || 0}\n`);
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
