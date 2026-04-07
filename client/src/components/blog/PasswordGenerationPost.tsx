import React from 'react';
import { Link } from 'wouter';
import { Lock, Zap, BarChart3, Shield, Check } from 'lucide-react';

export const PasswordGenerationPost: React.FC = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 mt-16 mb-20">
      <article>
        <header className="mb-16">
          <h1 className="text-3xl font-bold mb-6">How We Generate Secure Passwords</h1>
          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mb-8">
            <p className="text-lg">
              Creating a strong password is more than just combining random characters. At PrivateNote.ai, we've built our password generator with three core principles:
            </p>
          </div>
          
          {/* Core Principles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Cryptographic Security</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Using the same security standards as banks and financial institutions
              </p>
            </div>
            
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Unbiased Randomness</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Every character has an equal chance of being selected
              </p>
            </div>
            
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Intelligent Strength Analysis</h3>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Advanced analysis beyond simple length checks
              </p>
            </div>
          </div>
          
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
            <p>
              Let's take a look at how each component works to keep your accounts secure.
            </p>
          </div>
        </header>

        {/* Crypto Web API Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Lock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Crypto Web API</h2>
          </div>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              Our password generator uses the Crypto Web API for acquiring randomness. The Web Crypto API exposes a cryptographically secure random number generator suitable for security-critical tasks.
            </p>
            
            <p>
              It is securely seeded with high-entropy input from the operating system and designed so that its output cannot be predicted in practice. Without access to the generator's internal state, predicting future values is computationally infeasible.
            </p>
            
            <p>
              This is the same class of randomness used for generating encryption keys, session tokens, and secure identifiers.
            </p>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong className="text-gray-900 dark:text-white">Client-Side Security</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                All password generation happens entirely in your browser—your password never leaves your device. This means maximum privacy and security, as no server ever sees or stores your generated passwords. Even we don't know what passwords you're creating, which means they can't be intercepted, logged, or leaked from our servers.
              </p>
            </div>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">Why this matters:</strong> When passwords are generated server-side, they travel over the network and get stored in server logs. By generating passwords locally in your browser, we avoid these risks entirely.
              </p>
            </div>
          </div>
        </section>

        {/* Visual Separator */}
        <div className="my-16 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Unbiased Randomness Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unbiased Randomness</h2>
          </div>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              We use rejection sampling to make sure every character has an equal chance of being selected. This removes any bias that could make certain characters more likely to appear than others.
            </p>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong className="text-gray-900 dark:text-white">The Problem with Simple Randomness</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                When generating random numbers, many implementations use a modulo operation (like <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">randomValue % characterSetSize</code>). While this seems straightforward, it can introduce subtle bias. If the random number range doesn't divide evenly by the character set size, some characters become slightly more likely to appear than others.
              </p>
            </div>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong className="text-gray-900 dark:text-white">How Rejection Sampling Works</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Think of it like drawing names from a hat—if a name doesn't fit the criteria, we put it back and draw again. Our algorithm generates random values and only accepts them if they fall within a "fair" range. If a value would create bias, we simply reject it and generate a new one. This gives us truly random passwords where every possible combination is equally likely.
              </p>
            </div>
            
            <p>
              This makes your passwords harder to predict or crack because attackers can't exploit patterns or biases in character selection. Each password position is independently random, which creates maximum entropy.
            </p>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">Example:</strong> If you're selecting from 62 characters and your random number generator produces values 0-4294967295, simple modulo would make the first 33 characters appear slightly more often. Rejection sampling ensures perfect fairness.
              </p>
            </div>
          </div>
        </section>

        {/* Visual Separator */}
        <div className="my-16 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Smart Strength Analysis Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Strength Analysis</h2>
          </div>
          
          <div className="space-y-6 text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              We use advanced password strength estimation that goes beyond simple length checks. Our system looks at patterns, common words, and predictability to give you an accurate strength rating.
            </p>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong className="text-gray-900 dark:text-white">Beyond Length and Complexity</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Traditional password strength meters only check if your password is long enough or contains uppercase, lowercase, numbers, and symbols. But a password like "P@ssw0rd123!" might pass these checks while still being weak because it follows predictable patterns.
              </p>
            </div>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong className="text-gray-900 dark:text-white">How zxcvbn Works</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our strength analysis uses zxcvbn, a password strength estimation library developed by Dropbox. Let's see what it checks:
              </p>
              
              <ul className="space-y-3 ml-4 text-gray-600 dark:text-gray-400">
                <li>
                  <strong className="text-gray-900 dark:text-white">Common patterns:</strong> Keyboard patterns (like "qwerty"), sequences (like "12345"), and repeated characters
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Dictionary attacks:</strong> Common passwords, words, names, and variations found in password breach databases
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Entropy calculations:</strong> How much information is actually unpredictable in your password
                </li>
                <li>
                  <strong className="text-gray-900 dark:text-white">Crack time estimates:</strong> Realistic estimates of how long it would take an attacker to crack your password
                </li>
              </ul>
            </div>
            
            <p>
              This gives you a realistic sense of your password's security, not just a guess based on complexity rules. A password like "correct-horse-battery-staple" might score higher than "P@ssw0rd123!" because it's longer, uses uncommon word combinations, and doesn't follow predictable patterns.
            </p>
            
            <div className="my-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-900 dark:text-white">Score breakdown:</strong> Our strength meter shows scores from 0 (Very Weak) to 4 (Strong), based on zxcvbn's analysis. This helps you understand not just whether your password is "good enough," but how secure it actually is.
              </p>
            </div>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-primary" />
            Password Best Practices
          </h2>
          
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 flex-shrink-0">
                <Check className="h-4 w-4" />
              </span>
              <span><strong className="text-gray-900 dark:text-white">Use unique passwords:</strong> Never reuse passwords across different accounts. Each account should have its own unique password.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 flex-shrink-0">
                <Check className="h-4 w-4" />
              </span>
              <span><strong className="text-gray-900 dark:text-white">Longer is better:</strong> Aim for at least 16 characters. Longer passwords are exponentially harder to crack.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 flex-shrink-0">
                <Check className="h-4 w-4" />
              </span>
              <span><strong className="text-gray-900 dark:text-white">Use a password manager:</strong> Store your generated passwords securely in a password manager so you don't have to remember them.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 flex-shrink-0">
                <Check className="h-4 w-4" />
              </span>
              <span><strong className="text-gray-900 dark:text-white">Enable two-factor authentication:</strong> Even strong passwords benefit from an additional security layer.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15 flex-shrink-0">
                <Check className="h-4 w-4" />
              </span>
              <span><strong className="text-gray-900 dark:text-white">Don't share passwords:</strong> Never share your passwords with anyone, even if they claim to be from support.</span>
            </li>
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 dark:border-gray-800 pt-6">
          <Link
            href="/password-generator"
            className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
          >
            ← Back to Password Generator
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View All Articles →
          </Link>
        </div>
      </article>
    </div>
  );
};
