import pgPromise from "pg-promise";

export async function getAccount(accountId: string) {
    checkAccountIdIsValid(accountId);
    const connection = await getConnection()
    try {
        const [account] = await connection.query("select * from cccat15.account where account_id = $1", accountId);
        return account
    } finally {
        await connection.$pool.end();
    }
}

function checkAccountIdIsValid(accountId: string) {
    if (accountId && accountId.match(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i)) return;
    throw new Error("Invalid accountId")
}


function getConnection() {
	return pgPromise()("postgres://postgres:123456@localhost:5432/app")
}

