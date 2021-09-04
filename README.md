# BehaviorTree-TypeScript

<p align="center"><img src="docs/images/ReadTheDocs.png"></p>

[Translated form BehaviorTree.CPP](https://github.com/BehaviorTree/BehaviorTree.CPP)

It was designed to be flexible, easy to use, reactive and fast.

Even if our main use-case is **robotics**, you can use this library to build
**AI for games**, or to replace Finite State Machines in your application.

There are few features that make **BehaviorTree-TypeScript** unique, when compared to other implementations:

-   It makes **asynchronous Actions**, i.e. non-blocking, a first-class citizen.

-   You can build **reactive** behaviors that execute multiple Actions concurrently.

-   Trees are defined using a Domain Specific Scripting **scripting language** (based on XML), and can be loaded at run-time; in other words, even if written in C++, Trees are _not_ hard-coded.

-   You can statically link your custom TreeNodes or convert them into **plugins**
    which can be loaded at run-time.

-   It provides a type-safe and flexible mechanism to do **Dataflow** between
    Nodes of the Tree.

-   It includes a **logging/profiling** infrastructure that allows the user
    to visualize, record, replay and analyze state transitions.

-   Last but not least: it is well [documented](https://www.behaviortree.dev/)!

# Documentation

You can learn about the main concepts, the API and the tutorials here: https://www.behaviortree.dev/

To find more details about the conceptual ideas that make this implementation different from others, you can read the [final deliverable of the project MOOD2Be](https://github.com/BehaviorTree/BehaviorTree-TypeScript/blob/master/MOOD2Be_final_report.pdf).

# Design principles

The main goal of this project is to create a Behavior Tree implementation
that uses the principles of Model Driven Development to separate the role
of the **Component Developer** from the **Behavior Designer**.

In practice, this means that:

-   Custom TreeNodes must be reusable building blocks.
    You should be able to implement them once and reuse them to build many behaviors.

-   To build a Behavior Tree out of TreeNodes, the Behavior Designer must
    not need to read nor modify the C++ source code of a given TreeNode.

-   Complex Behaviours must be composable using Subtrees

Many of the features and, sometimes, the apparent limitations of this library, might be a consequence
of this design principle.

For instance, having a scoped BlackBoard, visible only in a portion of the tree, is particularly important
to avoid "name pollution" and allow the creation of large scale trees.

# Further readings

-   Introductory article: [Behavior trees for AI: How they work](http://www.gamasutra.com/blogs/ChrisSimpson/20140717/221339/Behavior_trees_for_AI_How_they_work.php)

-   **How Behavior Trees Modularize Hybrid Control Systems and Generalize
    Sequential Behavior Compositions, the Subsumption Architecture,
    and Decision Trees.**
    Michele Colledanchise and Petter Ogren. IEEE Transaction on Robotics 2017.

-   **Behavior Trees in Robotics and AI**,
    published by CRC Press Taylor & Francis, available for purchase
    (ebook and hardcover) on the CRC Press Store or Amazon.

# License

The MIT License (MIT)

Copyright (c) 2014-2018 Michele Colledanchise
Copyright (c) 2018-2021 Davide Faconti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
