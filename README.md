# Green-Time
A browser plugin to help people better use their time. It aims to use a kinder approach by not blocking the pages, but just reminding to user when they visit the pages. So the user gives the final decision of leaving a page, so they are not faced with an external force.

##Development Guide

> firstly you need [npm](https://nodejs.org/en/)  & [bower](http://bower.io/) & [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

1. Clone the repository
2. Run your favorite command line
3. Enter the ~/Green-Time/dev/ folder
  1. Run " npm update " command,
  2. Run " bower update " command,
  3. Run " gulp " command,
  4. Now you have ~/Green-Time/product folder.
4. Go to **chrome://extensions/** link on your browser and click the **load unpacked extension** button
  1. You can set ~/Green-Time/product/ folder for chrome extension package folder
  2. Note : **[Extensions Reloader](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid/)** extension very useful for development workflow. Every code changes need to reload for test on chrome
5. Now you ready for contributing.

Please feel free for contact us.

##ToDo-List


- [ ] Show notification modal
- [x] URL-List control
- [ ] Time tracking
  - [ ] Periodic Notifications
- [ ] Plug-in settings UI
- [ ] Activity time customization
  - [ ] Daytime
  - [ ] Weekdays
- [x] URL-List Customization
  - [x] Single list
  - [ ] Multi list
- [ ] Modal Customization
  - [ ] OK-button
  - [ ] Continue/Cancel
  - [ ] Auto-close
- [x] Message Customization
  - [x] Text
  - [ ] Multi-media
- [ ] Reaction Customization
  - [ ] Close tab
  - [ ] Redirect to URL

# Future Features

- [ ] Authorization
- [ ] Proactivity analysis
- [ ] Gamification
  - [ ] Achievements
- [ ] Localization
  - [ ] Multilanguage
