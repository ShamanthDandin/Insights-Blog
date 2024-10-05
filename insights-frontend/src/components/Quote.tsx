import { useState, useEffect } from 'react';

export const Quote = () => {
  const quotes = [
    "'I feel like all my kids grew up and then they married each other. It’s every parent’s dream.'",
    "'If I had a gun with two bullets and I was in a room with Hitler, Bin Laden, and Toby, I would shoot Toby twice.'",
    "'Sometimes I'll start a sentence and I don't even know where it's going. I just hope I find it along the way.'",
    "'Would I rather be feared or loved? Easy. Both. I want people to be afraid of how much they love me.'",
    "'You know what they say. Fool me once, strike one, but fool me twice...strike three.'"
  ];

  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []); // empty dependency array ensures this runs once on mount (i.e., when the page is refreshed)

  return (
    <div className="bg-slate-200 h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="max-w-xl">
          <div className="text-3xl font-bold">
            A Great Man Once Said,
          </div>
          <div className="text-3xl font-bold">
            {quote}
          </div>
          <div className="max-w-md text-xl font-semibold text-left mt-4">
            Michael Scott
          </div>
          <div className="max-w-md text-sm font-light text-slate-400">
            The Great Man
          </div>
        </div>
      </div>
    </div>
  );
};
