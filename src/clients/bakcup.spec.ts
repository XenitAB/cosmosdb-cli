const mock_array = [
  {
    db_id: "db_1",
    container_id: "container_1",
    item_count: 1,
    items: [
      {
        id: "item_1",
        foo: "bar",
        _rid: "3RZzAONonFcBAAAAAAAAAA==",
        _self: "dbs/3RZzAA==/colls/3RZzAONonFc=/docs/3RZzAONonFcBAAAAAAAAAA==/",
        _etag: '"6700d676-0000-0d00-0000-5f0b50920000"',
        _attachments: "attachments/",
        _ts: 1594577042,
      },
    ],
  },
  {
    db_id: "db_2",
    container_id: "container_2",
    item_count: 1,
    items: [
      {
        id: "item_2",
        foo: "bar",
        _rid: "LLVPAIjzFDoBAAAAAAAAAA==",
        _self: "dbs/LLVPAA==/colls/LLVPAIjzFDo=/docs/LLVPAIjzFDoBAAAAAAAAAA==/",
        _etag: '"a200de47-0000-0d00-0000-5f0b50a30000"',
        _attachments: "attachments/",
        _ts: 1594577059,
      },
    ],
  },
  {
    db_id: "db_3",
    container_id: "container_3",
    item_count: 1,
    items: [
      {
        id: "foo",
        foo: "bar",
        _rid: "XTxWAMjAZEEBAAAAAAAAAA==",
        _self: "dbs/XTxWAA==/colls/XTxWAMjAZEE=/docs/XTxWAMjAZEEBAAAAAAAAAA==/",
        _etag: '"d3000c52-0000-0d00-0000-5f1746800000"',
        _attachments: "attachments/",
        _ts: 1595360896,
      },
    ],
  },
];

describe("backup tests", () => {
  it("DUMMY TEST", () => {
    expect(1).toEqual(1);
  });
});
