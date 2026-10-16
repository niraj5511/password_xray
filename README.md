# Password X-Ray

A small web tool that shows, as you type, how long a password would take to brute-force. It displays an entropy gauge, an estimated crack time, the password length, and which character types are used.

Built with plain HTML, CSS and JavaScript. No frameworks, no dependencies, no build step.

## Features

- Live entropy gauge (in bits) that changes colour by strength
- Estimated crack time, from "instant" up to centuries
- Length indicator (up to 24 dots)
- Badges for the character types detected: `a–z`, `A–Z`, `0–9`, symbols
- "Run Demo" button that types four example passwords to show how the numbers change
- Light and dark mode, following the system setting
- Works on mobile

## How to Run

Open `index.html` in a browser. Nothing to install.

## How It Works

1. The password is checked for four character types. Each type present adds to the character pool:

   | Type | Pool size |
   |---|---:|
   | Lowercase | 26 |
   | Uppercase | 26 |
   | Digits | 10 |
   | Symbols | 32 |

2. Entropy in bits = `length × log2(pool size)`.
3. Crack time assumes 10 billion guesses per second and an average of half the search space.
4. Gauge colour: red below 35 bits, orange below 65 bits, green at 65 bits or more. The gauge is full at 100 bits.

## Privacy

Everything runs in your browser. The password is not sent anywhere or stored. The input field is plain text (not masked) so you can see what you type, so avoid using a real password while others can see your screen.

## Limitations

- This is a charset-based estimate, not a real cracking benchmark. The page says so in its footnote.
- It does not check for dictionary words, common passwords, keyboard patterns or repeated characters. For example, `password` is scored only by its length and character types, even though attackers try it first.
- The 10 billion guesses per second figure is a fixed assumption. Real speed depends on the hash algorithm and hardware.

## Project Structure

```
password_xray/
├── index.html   # Page layout
├── styles.css   # Styling and theme
└── script.js    # Entropy calculation and UI updates
```

## Author

Niraj Bhusal — [bhusalniraj.com.np](https://bhusalniraj.com.np) · [GitHub](https://github.com/niraj5511)
