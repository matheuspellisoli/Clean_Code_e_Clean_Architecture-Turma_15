drop schema cccat15 cascade;
create schema cccat15;
create table cccat15.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
);
create table cccat15.ride (
	ride_id uuid primary key,
	passenger_id uuid,
	driver_id uuid,
	status text,
	fare numeric,
	distance numeric,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	date timestamp
);


INSERT INTO cccat15.account
(account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
VALUES('d10eb684-7152-4f3d-b324-706ee441ac1c'::uuid, 'Alcides Silva', 'alcides@teste.com.br', '840.862.960-39', NULL, true, false);

INSERT INTO cccat15.account
(account_id, "name", email, cpf, car_plate, is_passenger, is_driver)
VALUES('d32bcf05-099c-4141-bd03-6eefea3518b8'::uuid, 'Carlos Silva', 'carlos@teste.com.br', '840.862.960-39', 'JYV2601', false, true);