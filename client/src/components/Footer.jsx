import React from 'react'
// import "../styles/index.scss";
const Footer = () => {
  return (

   

<footer class="bg-[#3E362E]">
    <div class="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div class="md:flex md:justify-between">
          <div class="mb-6 md:mb-0">
              <a href="http://localhost:5173/" class="flex items-center">
                  {/* <img src="/assetsdesigner.png" class="h-8 me-3" alt="FlowBite Logo" /> */}
                  <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Fashion Fusion</span>
              </a>
          </div>
          <div class="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="http://localhost:5173/" class="hover:underline">StyleSync</a>
                      </li>
                      <li>
                          <a href="http://localhost:5173/#about" class="hover:underline">About us</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="https://github.com/pranayvaranasi" class="hover:underline ">Github</a>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 class="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                  <ul class="text-gray-500 dark:text-gray-400 font-medium">
                      <li class="mb-4">
                          <a href="http://localhost:5173/term" class="hover:underline">Privacy Policy</a>
                      </li>
                      <li>
                          <a href="http://localhost:5173/term" class="hover:underline">Terms &amp; Conditions</a>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <div class="sm:flex sm:items-center sm:justify-between">
          <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="http://localhost:5173/" class="hover:underline">StyleSync</a>. All Rights Reserved.
          </span>
      </div>
    </div>


</footer>
  )
}

export default Footer;