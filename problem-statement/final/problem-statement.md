# Braille File Formats - Problem Statement
Document version: August 17, 2022

## Context

The two approaches currently used for distributing materials to be read in Braille each have their advantages, however neither offer a complete solution to the needs of braille readers nor can take advantage of the new possibilities of multiline displays.

1. Text based braille formats are used to create hardcopy braille, dynamic refreshable braille, and as a medium to edit and share braille using software. Several formats are in use, including BRF, BRA, BRL, and PEF. Text based braille formats are easy to create and share, but there are important limitations, including the lack of support for integrating graphics and the very limited support for navigation. Text based braille formats are not robust enough to accommodate basic features found in current print and digital text file formats and are long overdue for an upgrade. 

2. Digital text file formats can be read on a braille display or used for embossing. Several formats are in use, including DAISY, EPUB, HTML and Office Open XML (Word). Digital text-based formats offer advantages such as allowing readers to navigate quickly using links, for content to be formatted to page sizes dynamically, and support for text to speech. However, this approach relies on a screen reader to dynamically translate text to braille and cannot utilize pre-formatted, transcribed, proof-read braille. Transcribed braille is especially important for educational, science, math, and music content, and when readers are learning braille.

There is currently no standardized way for tactile graphics to be encoded for reading on digital devices, in either text-based braille or digital text formats.

## Issue

Digital text file formats allow readers to navigate quickly using links, for content to be formatted to page sizes dynamically, and include non-text items. These same basic features are not supported in the existing text-based braille formats. 
Whilst text-based braille formats can reliably present transcribed braille and preserve the spatial formatting, the chief problem is that they have no markup. Many other deficiencies stem from this core problem:

* The line and page size are hardcoded and cannot be easily changed after the file is created.
* Navigation is difficult because you are limited to very basic Find functions.
* A braille file cannot easily be edited since changes to the current line or page size will cascade through the document and potentially require more edits.
* The formatting and braille code of the file are hardcoded, and it is not easy to back translate or reformat the file to fit a new standard--the file is basically locked to a specific region of the world.

The lack of markup is especially troubling because in many braille transcription programs, the user is applying markup to the file that is used to create the braille file (such as headings). This markup is then just thrown out when the file is transcribed to braille.

Another limitation of text-based braille formats is that they do not contain graphics. This creates problems for the reader and for braille producers. For producers, it means that braille will be more expensive and harder to produce, requiring labor to create tactile graphics separately and sort them into braille volumes. These problems are then passed on to readers who must pay more and wait longer for the braille that they need. It also means that multiline braille and tactile graphics devices are not able to display the braille and graphics simultaneously, and devices and embossers that do not support tactile graphics have no idea that a graphic is even supposed to be present. A goal of a new format will be to integrate text and graphics into one file format. In cases where a device or embosser does not support rendering graphics, alt text could be presented instead--all from a single file.

An improved braille file type would also make it easier to share braille across international boundaries. The file formats that are in use today are often usable only in a specific region of the world due to differences in braille encoding and formatting. This compounds a key problem in the field: there are not enough braille transcribers. If braille could be shared throughout the world, the supply of braille available to individual readers would go up and that would also bring the cost down.
If content and presentation were separated, reading software could focus on the relatively simple problem of translation and retain the much more complicated formatting work from the original braille file. This would allow us to maximize the sharing of braille materials and leverage braille transcription work worldwide.

## Scale

Whether the goal is to provide a high-quality digital file or produce embossed braille, a better-quality braille file format will support a better experience for all braille readers. We anticipate that multi-line dynamic refreshable braille displays will soon become a regular means for providing access to braille, and a new braille format is essential to support these new devices. The new file format will also benefit existing single line refreshable braille devices by providing superior navigation. However, the new braille format will also benefit the production of embossed braille by allowing for seamless embossing of text and graphics. In short, it will improve braille access whether the medium is hard copy braille or digital and allow braille readers to benefit from technological opportunities that did not exist when the BRF format was developed. 

## Importance of Resolution

In order for braille readers to benefit from advances in technology, a new braille format is required. Providing access to text and graphics through dynamic refreshable multi-line displays will support braille literacy and education internationally and move the field forward. We want to ensure that braille readers benefit from the promise of a new generation of devices and embossers, and further increase the availability of content in braille across adults and children, and especially for those in educational settings. 

The new braille file format should be based as much as possible on existing specifications and if it is found that an existing file type can solve these problems, then that should become the new braille file standard. It is important that we consider the needs of braille users, producers, libraries, and hardware and software manufacturers as we examine these issues and look for a solution.

If these problems can be solved, it will improve braille access for people throughout the world, whether they read embossed braille, on their current braille device or on a future multi-line refreshable display. It will mean that braille files will be more dynamic, responsive, and navigable. We will be able to include graphics and, if we can improve the ability to share braille across borders, that braille will be cheaper and more available than ever before. The time to address these problems is now. The entire field is ready for an updated braille file format.

## Principles

The following principles will guide this initiative:
* Braille encoding first- the focus of this effort is on finding a modern solution for distributing information to be read as braille, although we will discuss the possibility of including other information types and multimodal reading.
* Mainstream if possible- in alignment with the strategic direction of the accessibility movement, a solution based on mainstream standards and technologies is strongly preferred.
* Refreshable braille is higher focus than embossed- whilst it may be possible to cover both braille on refreshable braille displays and embossed braille, the priority is for braille that will be read on braille devices.
* Consider less sophisticated devices but not limited by them- we will note that some of the less sophisticated braille devices (e.g., low memory or processing power) would not be able to natively handle more sophisticated file formats, this can be explored and discussed in later stages.

