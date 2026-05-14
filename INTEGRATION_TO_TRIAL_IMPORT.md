# Integration To Trial Import Notes

## Purpose

This document is a brief record of how content types and content were moved from the Optimizely `Integration` environment into the `Trial1` environment for practice.

It also captures the two main blockers faced during import and how they were resolved.

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

Additional migration issues Possible:


Issue 1: Export contained only content types, not content items
Observed behavior:

export succeeded
import succeeded
import summary showed content types were imported
but Number of content items was 0
What this meant:

the package did not contain actual pages or authored content
only schema/model definitions were moved

so
always check import summary after every import
do not assume a successful import means content also came in
validate Number of content items separately from Number of content types

Issue 2: Exporting a branch did not include the expected full content tree
Observed behavior:

a branch such as Services or a high-level option such as For All Applications was selected
export still showed only a very small number of content items
What this meant:

the selected root did not contain the full content tree in the way expected
or the UI allowed only one root selection at a time
or the package being tested was still too narrow

So
verify the selected structure carefully
if the UI only supports one root selection, export one branch at a time if necessary
always use Include sub items

Issue 3: One root item could be selected at a time
Observed behavior:

the export structure selector did not allow selecting multiple top-level nodes together
What this meant:

exports might need to be done branch by branch
for example: Header Footer Services Industries Case Studies

So
if the source tree is split into separate top-level branches, one full-site export may not always be practical through the UI
in that case, use multiple exports or use the broadest valid common root available

Issue 4: Destination mismatch during content import
Observed error:

The import destination is under root 'Assets' but export was created from 'Root page' which is not a compatible structure

What this meant:

a page/content export was being imported into an incompatible destination
Optimizely considered the selected import destination to be under an asset-side structure rather than the expected page/content structure

So
page exports must be imported into a page/content root
asset exports must be imported into an asset-compatible destination
the visible label in the picker may not always make the internal structure obvious, so the error message must be trusted



## Recommended process for future migrations

When repeating this process in future:

1. Compare source and target content types before import
2. Clean or align conflicting content types in the target environment
3. Confirm required languages exist in the target environment
4. Import content types first
5. Import content items second
6. Verify imported content types and content tree after each stage

