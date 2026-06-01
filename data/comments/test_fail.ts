import type { CommentEntry } from './index.js';

// TODO: expand to 15-30 entries
export const testFailPool: CommentEntry[] = [
  { text: "test failed. the test is not wrong." },
  { text: "red. everything is red." },
  { text: "the test suite has opinions about your code." },
  { text: "tests lie sometimes. this is not one of those times.", trait: ['Blunt'] },
  { text: "a failing test is just a bug with documentation.", trait: ['Analytical'] },
  { text: "I'm not going to say I told you so. I'm going to think it.", trait: ['Judgmental'] },
  { text: "the tests just want you to do better.", trait: ['Nurturing'] },
  { text: "FAILURE IS JUST SUCCESS IN DISGUISE!! (it's not)", trait: ['Chaotic'] },
];
