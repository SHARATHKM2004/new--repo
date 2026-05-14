# Integration To Trial Import Notes

## Purpose

This document records how content types and content were moved from one Optimizely SaaS CMS environment to another, with the main real example being `Integration` to `Trial1`.

It is also intended to help future migrations such as:

1. `Trial2` to `Trial1`
2. `Integration` to `Trial1`
3. any similar source-to-target migration between environments

It captures the migration order, practical steps, and the main issues faced during export and import, along with how those issues were resolved.

## Goal

Move the CMS setup built in `Integration` into `Trial1` so the same content model and authored structure can be used for learning and practice.

## Environments

1. Source environment: `Integration`
2. Target environment: `Trial1`

## Migration approach used

The migration was done using Optimizely CMS `Export Data` and `Import Data`.

The safest order was:

1. Import content types first
2. Import content items after content types are available in the target environment

This order is critical because pages, blocks, and authored content depend on content types already existing in the target environment.

## General migration rule

When migrating between environments, always separate the process into two parts:

1. schema/model migration
2. content migration

Schema/model migration means:

1. content types
2. block types
3. page types
4. binding definitions
5. related language and tab setup where needed

Content migration means:

1. pages
2. blocks
3. authored items
4. linked files or media references

## Step-by-step process followed

### 1. Export content types from Integration

In the source environment:

1. Open `Settings`
2. Open `Export Data`
3. Expand `Export content types`
4. Select the required content types from the Integration environment
5. Run `Test Run with Error Log`
6. If validation passes, click `Export`
7. Download the generated `.episerverdata` file

### 2. Import content types into Trial1

In the target environment:

1. Open `Settings`
2. Open `Import Data`
3. Upload the exported `.episerverdata` file
4. Choose the content destination available in Trial1
5. Run verification
6. Start the import

### 3. Export content items from Integration

After content types were handled:

1. Open `Export Data` again in Integration
2. Expand `Export content items`
3. Choose the required content tree or root branch to export
4. Enable:
   `Include sub items`
   `Export files that the pages link to`
   `Automatically export dependent content types`
5. Run `Test Run with Error Log`
6. Export the package

### 4. Import content items into Trial1

In Trial1:

1. Open `Import Data`
2. Upload the exported content package
3. Select the correct content destination
4. Verify the package
5. Start the import

## Additional migration issues faced during practice

The migration practice included not just `Integration` to `Trial1`, but also trial-to-trial testing to understand the export/import process before using the real Integration package.

The issues below are important because they may happen again in future migrations.

### Issue 1: Export contained only content types, not content items

Observed behavior:

1. export succeeded
2. import succeeded
3. import summary showed content types were imported
4. but `Number of content items` was `0`

What this meant:

1. the package did not contain actual pages or authored content
2. only schema/model definitions were moved

Lesson learned:

1. always check import summary after every import
2. do not assume a successful import means content also came in
3. validate `Number of content items` separately from `Number of content types`

### Issue 2: Exporting a branch did not include the expected full content tree

Observed behavior:

1. a branch such as `Services` or a high-level option such as `For All Applications` was selected
2. export still showed only a very small number of content items

What this meant:

1. the selected root did not contain the full content tree in the way expected
2. or the UI allowed only one root selection at a time
3. or the package being tested was still too narrow

Lesson learned:

1. verify the selected structure carefully
2. if the UI only supports one root selection, export one branch at a time if necessary
3. always use `Include sub items`

### Issue 3: One root item could be selected at a time

Observed behavior:

1. the export structure selector did not allow selecting multiple top-level nodes together

What this meant:

1. exports might need to be done branch by branch
2. for example:
   `Header`
   `Footer`
   `Services`
   `Industries`
   `Case Studies`

Lesson learned:

1. if the source tree is split into separate top-level branches, one full-site export may not always be practical through the UI
2. in that case, use multiple exports or use the broadest valid common root available

### Issue 4: Destination mismatch during content import

Observed error:

`The import destination is under root 'Assets' but export was created from 'Root page' which is not a compatible structure`

What this meant:

1. a page/content export was being imported into an incompatible destination
2. Optimizely considered the selected import destination to be under an asset-side structure rather than the expected page/content structure

Lesson learned:

1. page exports must be imported into a page/content root
2. asset exports must be imported into an asset-compatible destination
3. the visible label in the picker may not always make the internal structure obvious, so the error message must be trusted

### Issue 5: Content type mismatch in target environment

Observed behavior:

1. import failed because a content type in the target environment already existed with the same name but a different definition

Example:

1. `Footer` in one environment was based on `Block`
2. `Footer` in another environment was based on `Page`

Lesson learned:

1. source and target environments must be aligned before importing content types
2. if necessary, rename, delete, or recreate conflicting target content types first

### Issue 6: Missing language branch in target environment

Observed error:

`Language branch "ar" is not defined`

What this meant:

1. the export package referenced content using the `ar` language branch
2. the target environment did not have that language configured

Lesson learned:

1. language configuration must be aligned before content import
2. target environment languages should be checked before importing multilingual content

## Main blockers faced

### Blocker 1: Content type conflict

The first major issue was a content type conflict involving `Footer`.

Observed error:

`The Base property cannot be changed once the content type has been created. The content type 'Footer' with base 'Block' does not match the existing value 'Page'.`

What this meant:

1. `Footer` already existed in `Trial1`
2. The `Footer` definition in `Trial1` did not match the `Footer` definition from `Integration`
3. Optimizely does not allow the base type of an existing content type to be changed through import

How it was resolved:

1. The conflicting `Footer` content type in `Trial1` was removed
2. The content type import was retried
3. After removing the conflict, the content type import succeeded

Result:

Content types from Integration were able to come into Trial1.

This issue is one of the most important migration blockers because it prevents the target environment from receiving the source schema cleanly.

### Blocker 2: Missing language branch

The second major issue happened during content import.

Observed error:

`Language branch "ar" is not defined`

What this meant:

1. The exported package referenced the `ar` language
2. `Trial1` did not have the `ar` language configured
3. The import could not complete correctly until the language existed in the target environment

How it was resolved:

1. The missing language branch `ar` was added in `Trial1`
2. The import was retried after adding the language

Result:

The language mismatch blocker was removed.

This issue is important because multilingual content packages may fail even when content types are already aligned.

## Important observations

1. A successful content type import does not mean content items were imported
2. Always check the import summary carefully
3. `Number of content types` and `Number of content items` should be read separately
4. Content type import and content item import are two different stages
5. A green or partial success message is not enough without reading the counts and warnings
6. Destination compatibility matters during content import
7. Existing target content types can block migration even if the export package is correct

## Practical lessons learned

1. Import content types before content items
2. Resolve conflicting content types in the target environment before retrying import
3. Make sure all required language branches exist in the target environment before importing content
4. Use `Test Run with Error Log` before final export whenever possible
5. Read the import summary after every import instead of assuming the whole package came in correctly
6. If export UI limits structure selection, use multiple exports when necessary
7. If import destination causes a root mismatch, re-check whether the selected target is really a page/content root
8. If a package imports only content types, that does not prove pages/content moved

## Recommended process for future migrations

When repeating this process in future:

1. Compare source and target content types before import
2. Clean or align conflicting content types in the target environment
3. Confirm required languages exist in the target environment
4. Import content types first
5. Import content items second
6. Verify imported content types and content tree after each stage
7. If needed, break content exports into multiple branches and import them in a controlled order

## Recommended future migration checklist

Use this as the standard process when moving from one Optimizely environment to another.

### Before export

1. Confirm source environment
2. Confirm target environment
3. Compare core content types between source and target
4. Confirm required languages in target

### During export

1. Export content types first
2. Use `Test Run with Error Log`
3. Export content items separately after schema is ready
4. Use `Include sub items`
5. Use `Export files that the pages link to`
6. Use `Automatically export dependent content types`

### During import

1. Import content types first
2. Resolve errors before continuing
3. Import content items only after schema alignment is confirmed
4. Check destination compatibility carefully

### After import

1. Read summary counts
2. Confirm content types exist in target
3. Confirm pages/content items exist in target
4. Confirm languages and references are intact
5. Verify actual site behavior if the app points to the imported environment

<<<<<<< HEAD
=======
## Final summary

The Integration to Trial migration was achieved using Optimizely export/import, but it required understanding both the process and the common migration failures.

The most important blockers encountered were:

1. conflicting content types in Trial1, especially `Footer`
2. missing language branch `ar` in Trial1

Other practical migration issues also had to be understood, including:

1. exporting only content types without content items
2. branch selection limitations during export
3. root/destination mismatch during import
4. interpreting import summaries correctly

Once those were understood and handled, the path to move setup from one environment to another became much clearer and more repeatable.
>>>>>>> 2bc04bd (Expand integration to trial migration notes)
