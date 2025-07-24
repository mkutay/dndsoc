import { type PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import { errAsync, fromSafePromise, okAsync, ResultAsync } from "neverthrow";

import { createClient, createServiceClient } from "@/utils/supabase/server";
import { type Database } from "@/types/database.types";

// PostgreSQL Error Codes - Type Safe
export type PostgreSQLErrorCode =
  // Class 00 — Successful Completion
  | "00000" // successful_completion
  // Class 01 — Warning
  | "01000" // warning
  | "0100C" // dynamic_result_sets_returned
  | "01008" // implicit_zero_bit_padding
  | "01003" // null_value_eliminated_in_set_function
  | "01007" // privilege_not_granted
  | "01006" // privilege_not_revoked
  | "01004" // string_data_right_truncation
  | "01P01" // deprecated_feature
  // Class 02 — No Data
  | "02000" // no_data
  | "02001" // no_additional_dynamic_result_sets_returned
  // Class 03 — SQL Statement Not Yet Complete
  | "03000" // sql_statement_not_yet_complete
  // Class 08 — Connection Exception
  | "08000" // connection_exception
  | "08003" // connection_does_not_exist
  | "08006" // connection_failure
  | "08001" // sqlclient_unable_to_establish_sqlconnection
  | "08004" // sqlserver_rejected_establishment_of_sqlconnection
  | "08007" // transaction_resolution_unknown
  | "08P01" // protocol_violation
  // Class 09 — Triggered Action Exception
  | "09000" // triggered_action_exception
  // Class 0A — Feature Not Supported
  | "0A000" // feature_not_supported
  // Class 0B — Invalid Transaction Initiation
  | "0B000" // invalid_transaction_initiation
  // Class 0F — Locator Exception
  | "0F000" // locator_exception
  | "0F001" // invalid_locator_specification
  // Class 0L — Invalid Grantor
  | "0L000" // invalid_grantor
  | "0LP01" // invalid_grant_operation
  // Class 0P — Invalid Role Specification
  | "0P000" // invalid_role_specification
  // Class 0Z — Diagnostics Exception
  | "0Z000" // diagnostics_exception
  | "0Z002" // stacked_diagnostics_accessed_without_active_handler
  // Class 20 — Case Not Found
  | "20000" // case_not_found
  // Class 21 — Cardinality Violation
  | "21000" // cardinality_violation
  // Class 22 — Data Exception
  | "22000" // data_exception
  | "2202E" // array_subscript_error
  | "22021" // character_not_in_repertoire
  | "22008" // datetime_field_overflow
  | "22012" // division_by_zero
  | "22005" // error_in_assignment
  | "2200B" // escape_character_conflict
  | "22022" // indicator_overflow
  | "22015" // interval_field_overflow
  | "2201E" // invalid_argument_for_logarithm
  | "22014" // invalid_argument_for_ntile_function
  | "22016" // invalid_argument_for_nth_value_function
  | "2201F" // invalid_argument_for_power_function
  | "2201G" // invalid_argument_for_width_bucket_function
  | "22018" // invalid_character_value_for_cast
  | "22007" // invalid_datetime_format
  | "22019" // invalid_escape_character
  | "2200D" // invalid_escape_octet
  | "22025" // invalid_escape_sequence
  | "22P06" // nonstandard_use_of_escape_character
  | "22010" // invalid_indicator_parameter_value
  | "22023" // invalid_parameter_value
  | "22013" // invalid_preceding_or_following_size
  | "2201B" // invalid_regular_expression
  | "2201W" // invalid_row_count_in_limit_clause
  | "2201X" // invalid_row_count_in_result_offset_clause
  | "2202H" // invalid_tablesample_argument
  | "2202G" // invalid_tablesample_repeat
  | "22009" // invalid_time_zone_displacement_value
  | "2200C" // invalid_use_of_escape_character
  | "2200G" // most_specific_type_mismatch
  | "22004" // null_value_not_allowed
  | "22002" // null_value_no_indicator_parameter
  | "22003" // numeric_value_out_of_range
  | "2200H" // sequence_generator_limit_exceeded
  | "22026" // string_data_length_mismatch
  | "22001" // string_data_right_truncation
  | "22011" // substring_error
  | "22027" // trim_error
  | "22024" // unterminated_c_string
  | "2200F" // zero_length_character_string
  | "22P01" // floating_point_exception
  | "22P02" // invalid_text_representation
  | "22P03" // invalid_binary_representation
  | "22P04" // bad_copy_file_format
  | "22P05" // untranslatable_character
  | "2200L" // not_an_xml_document
  | "2200M" // invalid_xml_document
  | "2200N" // invalid_xml_content
  | "2200S" // invalid_xml_comment
  | "2200T" // invalid_xml_processing_instruction
  | "22030" // duplicate_json_object_key_value
  | "22031" // invalid_argument_for_sql_json_datetime_function
  | "22032" // invalid_json_text
  | "22033" // invalid_sql_json_subscript
  | "22034" // more_than_one_sql_json_item
  | "22035" // no_sql_json_item
  | "22036" // non_numeric_sql_json_item
  | "22037" // non_unique_keys_in_a_json_object
  | "22038" // singleton_sql_json_item_required
  | "22039" // sql_json_array_not_found
  | "2203A" // sql_json_member_not_found
  | "2203B" // sql_json_number_not_found
  | "2203C" // sql_json_object_not_found
  | "2203D" // too_many_json_array_elements
  | "2203E" // too_many_json_object_members
  | "2203F" // sql_json_scalar_required
  | "2203G" // sql_json_item_cannot_be_cast_to_target_type
  // Class 23 — Integrity Constraint Violation
  | "23000" // integrity_constraint_violation
  | "23001" // restrict_violation
  | "23502" // not_null_violation
  | "23503" // foreign_key_violation
  | "23505" // unique_violation
  | "23514" // check_violation
  | "23P01" // exclusion_violation
  // Class 24 — Invalid Cursor State
  | "24000" // invalid_cursor_state
  // Class 25 — Invalid Transaction State
  | "25000" // invalid_transaction_state
  | "25001" // active_sql_transaction
  | "25002" // branch_transaction_already_active
  | "25008" // held_cursor_requires_same_isolation_level
  | "25003" // inappropriate_access_mode_for_branch_transaction
  | "25004" // inappropriate_isolation_level_for_branch_transaction
  | "25005" // no_active_sql_transaction_for_branch_transaction
  | "25006" // read_only_sql_transaction
  | "25007" // schema_and_data_statement_mixing_not_supported
  | "25P01" // no_active_sql_transaction
  | "25P02" // in_failed_sql_transaction
  | "25P03" // idle_in_transaction_session_timeout
  | "25P04" // transaction_timeout
  // Class 26 — Invalid SQL Statement Name
  | "26000" // invalid_sql_statement_name
  // Class 27 — Triggered Data Change Violation
  | "27000" // triggered_data_change_violation
  // Class 28 — Invalid Authorization Specification
  | "28000" // invalid_authorization_specification
  | "28P01" // invalid_password
  // Class 2B — Dependent Privilege Descriptors Still Exist
  | "2B000" // dependent_privilege_descriptors_still_exist
  | "2BP01" // dependent_objects_still_exist
  // Class 2D — Invalid Transaction Termination
  | "2D000" // invalid_transaction_termination
  // Class 2F — SQL Routine Exception
  | "2F000" // sql_routine_exception
  | "2F005" // function_executed_no_return_statement
  | "2F002" // modifying_sql_data_not_permitted
  | "2F003" // prohibited_sql_statement_attempted
  | "2F004" // reading_sql_data_not_permitted
  // Class 34 — Invalid Cursor Name
  | "34000" // invalid_cursor_name
  // Class 38 — External Routine Exception
  | "38000" // external_routine_exception
  | "38001" // containing_sql_not_permitted
  | "38002" // modifying_sql_data_not_permitted
  | "38003" // prohibited_sql_statement_attempted
  | "38004" // reading_sql_data_not_permitted
  // Class 39 — External Routine Invocation Exception
  | "39000" // external_routine_invocation_exception
  | "39001" // invalid_sqlstate_returned
  | "39004" // null_value_not_allowed
  | "39P01" // trigger_protocol_violated
  | "39P02" // srf_protocol_violated
  | "39P03" // event_trigger_protocol_violated
  // Class 3B — Savepoint Exception
  | "3B000" // savepoint_exception
  | "3B001" // invalid_savepoint_specification
  // Class 3D — Invalid Catalog Name
  | "3D000" // invalid_catalog_name
  // Class 3F — Invalid Schema Name
  | "3F000" // invalid_schema_name
  // Class 40 — Transaction Rollback
  | "40000" // transaction_rollback
  | "40002" // transaction_integrity_constraint_violation
  | "40001" // serialization_failure
  | "40003" // statement_completion_unknown
  | "40P01" // deadlock_detected
  // Class 42 — Syntax Error or Access Rule Violation
  | "42000" // syntax_error_or_access_rule_violation
  | "42601" // syntax_error
  | "42501" // insufficient_privilege
  | "42846" // cannot_coerce
  | "42803" // grouping_error
  | "42P20" // windowing_error
  | "42P19" // invalid_recursion
  | "42830" // invalid_foreign_key
  | "42602" // invalid_name
  | "42622" // name_too_long
  | "42939" // reserved_name
  | "42804" // datatype_mismatch
  | "42P18" // indeterminate_datatype
  | "42P21" // collation_mismatch
  | "42P22" // indeterminate_collation
  | "42809" // wrong_object_type
  | "428C9" // generated_always
  | "42703" // undefined_column
  | "42883" // undefined_function
  | "42P01" // undefined_table
  | "42P02" // undefined_parameter
  | "42704" // undefined_object
  | "42701" // duplicate_column
  | "42P03" // duplicate_cursor
  | "42P04" // duplicate_database
  | "42723" // duplicate_function
  | "42P05" // duplicate_prepared_statement
  | "42P06" // duplicate_schema
  | "42P07" // duplicate_table
  | "42712" // duplicate_alias
  | "42710" // duplicate_object
  | "42702" // ambiguous_column
  | "42725" // ambiguous_function
  | "42P08" // ambiguous_parameter
  | "42P09" // ambiguous_alias
  | "42P10" // invalid_column_reference
  | "42611" // invalid_column_definition
  | "42P11" // invalid_cursor_definition
  | "42P12" // invalid_database_definition
  | "42P13" // invalid_function_definition
  | "42P14" // invalid_prepared_statement_definition
  | "42P15" // invalid_schema_definition
  | "42P16" // invalid_table_definition
  | "42P17" // invalid_object_definition
  // Class 44 — WITH CHECK OPTION Violation
  | "44000" // with_check_option_violation
  // Class 53 — Insufficient Resources
  | "53000" // insufficient_resources
  | "53100" // disk_full
  | "53200" // out_of_memory
  | "53300" // too_many_connections
  | "53400" // configuration_limit_exceeded
  // Class 54 — Program Limit Exceeded
  | "54000" // program_limit_exceeded
  | "54001" // statement_too_complex
  | "54011" // too_many_columns
  | "54023" // too_many_arguments
  // Class 55 — Object Not In Prerequisite State
  | "55000" // object_not_in_prerequisite_state
  | "55006" // object_in_use
  | "55P02" // cant_change_runtime_param
  | "55P03" // lock_not_available
  | "55P04" // unsafe_new_enum_value_usage
  // Class 57 — Operator Intervention
  | "57000" // operator_intervention
  | "57014" // query_canceled
  | "57P01" // admin_shutdown
  | "57P02" // crash_shutdown
  | "57P03" // cannot_connect_now
  | "57P04" // database_dropped
  | "57P05" // idle_session_timeout
  // Class 58 — System Error
  | "58000" // system_error
  | "58030" // io_error
  | "58P01" // undefined_file
  | "58P02" // duplicate_file
  // Class F0 — Configuration File Error
  | "F0000" // config_file_error
  | "F0001" // lock_file_exists
  // Class HV — Foreign Data Wrapper Error
  | "HV000" // fdw_error
  | "HV005" // fdw_column_name_not_found
  | "HV002" // fdw_dynamic_parameter_value_needed
  | "HV010" // fdw_function_sequence_error
  | "HV021" // fdw_inconsistent_descriptor_information
  | "HV024" // fdw_invalid_attribute_value
  | "HV007" // fdw_invalid_column_name
  | "HV008" // fdw_invalid_column_number
  | "HV004" // fdw_invalid_data_type
  | "HV006" // fdw_invalid_data_type_descriptors
  | "HV091" // fdw_invalid_descriptor_field_identifier
  | "HV00B" // fdw_invalid_handle
  | "HV00C" // fdw_invalid_option_index
  | "HV00D" // fdw_invalid_option_name
  | "HV090" // fdw_invalid_string_length_or_buffer_length
  | "HV00A" // fdw_invalid_string_format
  | "HV009" // fdw_invalid_use_of_null_pointer
  | "HV014" // fdw_too_many_handles
  | "HV001" // fdw_out_of_memory
  | "HV00P" // fdw_no_schemas
  | "HV00J" // fdw_option_name_not_found
  | "HV00K" // fdw_reply_handle
  | "HV00Q" // fdw_schema_not_found
  | "HV00R" // fdw_table_not_found
  | "HV00L" // fdw_unable_to_create_execution
  | "HV00M" // fdw_unable_to_create_reply
  | "HV00N" // fdw_unable_to_establish_connection
  // Class P0 — PL/pgSQL Error
  | "P0000" // plpgsql_error
  | "P0001" // raise_exception
  | "P0002" // no_data_found
  | "P0003" // too_many_rows
  | "P0004" // assert_failure
  // Class XX — Internal Error
  | "XX000" // internal_error
  | "XX001" // data_corrupted
  | "XX002"; // index_corrupted

// Error code to human-readable description mapping
export const PostgreSQLErrorMessages: Record<PostgreSQLErrorCode, string> = {
  // Class 00 — Successful Completion
  "00000": "Successful completion",
  // Class 01 — Warning
  "01000": "Warning",
  "0100C": "Dynamic result sets returned",
  "01008": "Implicit zero bit padding",
  "01003": "Null value eliminated in set function",
  "01007": "Privilege not granted",
  "01006": "Privilege not revoked",
  "01004": "String data right truncation",
  "01P01": "Deprecated feature",
  // Class 02 — No Data
  "02000": "No data",
  "02001": "No additional dynamic result sets returned",
  // Class 03 — SQL Statement Not Yet Complete
  "03000": "SQL statement not yet complete",
  // Class 08 — Connection Exception
  "08000": "Connection exception",
  "08003": "Connection does not exist",
  "08006": "Connection failure",
  "08001": "SQL client unable to establish SQL connection",
  "08004": "SQL server rejected establishment of SQL connection",
  "08007": "Transaction resolution unknown",
  "08P01": "Protocol violation",
  // Class 09 — Triggered Action Exception
  "09000": "Triggered action exception",
  // Class 0A — Feature Not Supported
  "0A000": "Feature not supported",
  // Class 0B — Invalid Transaction Initiation
  "0B000": "Invalid transaction initiation",
  // Class 0F — Locator Exception
  "0F000": "Locator exception",
  "0F001": "Invalid locator specification",
  // Class 0L — Invalid Grantor
  "0L000": "Invalid grantor",
  "0LP01": "Invalid grant operation",
  // Class 0P — Invalid Role Specification
  "0P000": "Invalid role specification",
  // Class 0Z — Diagnostics Exception
  "0Z000": "Diagnostics exception",
  "0Z002": "Stacked diagnostics accessed without active handler",
  // Class 20 — Case Not Found
  "20000": "Case not found",
  // Class 21 — Cardinality Violation
  "21000": "Cardinality violation",
  // Class 22 — Data Exception
  "22000": "Data exception",
  "2202E": "Array subscript error",
  "22021": "Character not in repertoire",
  "22008": "Datetime field overflow",
  "22012": "Division by zero",
  "22005": "Error in assignment",
  "2200B": "Escape character conflict",
  "22022": "Indicator overflow",
  "22015": "Interval field overflow",
  "2201E": "Invalid argument for logarithm",
  "22014": "Invalid argument for ntile function",
  "22016": "Invalid argument for nth value function",
  "2201F": "Invalid argument for power function",
  "2201G": "Invalid argument for width bucket function",
  "22018": "Invalid character value for cast",
  "22007": "Invalid datetime format",
  "22019": "Invalid escape character",
  "2200D": "Invalid escape octet",
  "22025": "Invalid escape sequence",
  "22P06": "Nonstandard use of escape character",
  "22010": "Invalid indicator parameter value",
  "22023": "Invalid parameter value",
  "22013": "Invalid preceding or following size",
  "2201B": "Invalid regular expression",
  "2201W": "Invalid row count in limit clause",
  "2201X": "Invalid row count in result offset clause",
  "2202H": "Invalid tablesample argument",
  "2202G": "Invalid tablesample repeat",
  "22009": "Invalid time zone displacement value",
  "2200C": "Invalid use of escape character",
  "2200G": "Most specific type mismatch",
  "22004": "Null value not allowed",
  "22002": "Null value no indicator parameter",
  "22003": "Numeric value out of range",
  "2200H": "Sequence generator limit exceeded",
  "22026": "String data length mismatch",
  "22001": "String data right truncation",
  "22011": "Substring error",
  "22027": "Trim error",
  "22024": "Unterminated C string",
  "2200F": "Zero length character string",
  "22P01": "Floating point exception",
  "22P02": "Invalid text representation",
  "22P03": "Invalid binary representation",
  "22P04": "Bad copy file format",
  "22P05": "Untranslatable character",
  "2200L": "Not an XML document",
  "2200M": "Invalid XML document",
  "2200N": "Invalid XML content",
  "2200S": "Invalid XML comment",
  "2200T": "Invalid XML processing instruction",
  "22030": "Duplicate JSON object key value",
  "22031": "Invalid argument for SQL JSON datetime function",
  "22032": "Invalid JSON text",
  "22033": "Invalid SQL JSON subscript",
  "22034": "More than one SQL JSON item",
  "22035": "No SQL JSON item",
  "22036": "Non-numeric SQL JSON item",
  "22037": "Non-unique keys in a JSON object",
  "22038": "Singleton SQL JSON item required",
  "22039": "SQL JSON array not found",
  "2203A": "SQL JSON member not found",
  "2203B": "SQL JSON number not found",
  "2203C": "SQL JSON object not found",
  "2203D": "Too many JSON array elements",
  "2203E": "Too many JSON object members",
  "2203F": "SQL JSON scalar required",
  "2203G": "SQL JSON item cannot be cast to target type",
  // Class 23 — Integrity Constraint Violation
  "23000": "Integrity constraint violation",
  "23001": "Restrict violation",
  "23502": "Not null violation",
  "23503": "Foreign key violation",
  "23505": "Unique violation",
  "23514": "Check violation",
  "23P01": "Exclusion violation",
  // Class 24 — Invalid Cursor State
  "24000": "Invalid cursor state",
  // Class 25 — Invalid Transaction State
  "25000": "Invalid transaction state",
  "25001": "Active SQL transaction",
  "25002": "Branch transaction already active",
  "25008": "Held cursor requires same isolation level",
  "25003": "Inappropriate access mode for branch transaction",
  "25004": "Inappropriate isolation level for branch transaction",
  "25005": "No active SQL transaction for branch transaction",
  "25006": "Read only SQL transaction",
  "25007": "Schema and data statement mixing not supported",
  "25P01": "No active SQL transaction",
  "25P02": "In failed SQL transaction",
  "25P03": "Idle in transaction session timeout",
  "25P04": "Transaction timeout",
  // Class 26 — Invalid SQL Statement Name
  "26000": "Invalid SQL statement name",
  // Class 27 — Triggered Data Change Violation
  "27000": "Triggered data change violation",
  // Class 28 — Invalid Authorization Specification
  "28000": "Invalid authorization specification",
  "28P01": "Invalid password",
  // Class 2B — Dependent Privilege Descriptors Still Exist
  "2B000": "Dependent privilege descriptors still exist",
  "2BP01": "Dependent objects still exist",
  // Class 2D — Invalid Transaction Termination
  "2D000": "Invalid transaction termination",
  // Class 2F — SQL Routine Exception
  "2F000": "SQL routine exception",
  "2F005": "Function executed no return statement",
  "2F002": "Modifying SQL data not permitted",
  "2F003": "Prohibited SQL statement attempted",
  "2F004": "Reading SQL data not permitted",
  // Class 34 — Invalid Cursor Name
  "34000": "Invalid cursor name",
  // Class 38 — External Routine Exception
  "38000": "External routine exception",
  "38001": "Containing SQL not permitted",
  "38002": "Modifying SQL data not permitted",
  "38003": "Prohibited SQL statement attempted",
  "38004": "Reading SQL data not permitted",
  // Class 39 — External Routine Invocation Exception
  "39000": "External routine invocation exception",
  "39001": "Invalid SQLSTATE returned",
  "39004": "Null value not allowed",
  "39P01": "Trigger protocol violated",
  "39P02": "SRF protocol violated",
  "39P03": "Event trigger protocol violated",
  // Class 3B — Savepoint Exception
  "3B000": "Savepoint exception",
  "3B001": "Invalid savepoint specification",
  // Class 3D — Invalid Catalog Name
  "3D000": "Invalid catalog name",
  // Class 3F — Invalid Schema Name
  "3F000": "Invalid schema name",
  // Class 40 — Transaction Rollback
  "40000": "Transaction rollback",
  "40002": "Transaction integrity constraint violation",
  "40001": "Serialization failure",
  "40003": "Statement completion unknown",
  "40P01": "Deadlock detected",
  // Class 42 — Syntax Error or Access Rule Violation
  "42000": "Syntax error or access rule violation",
  "42601": "Syntax error",
  "42501": "Insufficient privilege",
  "42846": "Cannot coerce",
  "42803": "Grouping error",
  "42P20": "Windowing error",
  "42P19": "Invalid recursion",
  "42830": "Invalid foreign key",
  "42602": "Invalid name",
  "42622": "Name too long",
  "42939": "Reserved name",
  "42804": "Datatype mismatch",
  "42P18": "Indeterminate datatype",
  "42P21": "Collation mismatch",
  "42P22": "Indeterminate collation",
  "42809": "Wrong object type",
  "428C9": "Generated always",
  "42703": "Undefined column",
  "42883": "Undefined function",
  "42P01": "Undefined table",
  "42P02": "Undefined parameter",
  "42704": "Undefined object",
  "42701": "Duplicate column",
  "42P03": "Duplicate cursor",
  "42P04": "Duplicate database",
  "42723": "Duplicate function",
  "42P05": "Duplicate prepared statement",
  "42P06": "Duplicate schema",
  "42P07": "Duplicate table",
  "42712": "Duplicate alias",
  "42710": "Duplicate object",
  "42702": "Ambiguous column",
  "42725": "Ambiguous function",
  "42P08": "Ambiguous parameter",
  "42P09": "Ambiguous alias",
  "42P10": "Invalid column reference",
  "42611": "Invalid column definition",
  "42P11": "Invalid cursor definition",
  "42P12": "Invalid database definition",
  "42P13": "Invalid function definition",
  "42P14": "Invalid prepared statement definition",
  "42P15": "Invalid schema definition",
  "42P16": "Invalid table definition",
  "42P17": "Invalid object definition",
  // Class 44 — WITH CHECK OPTION Violation
  "44000": "WITH CHECK OPTION violation",
  // Class 53 — Insufficient Resources
  "53000": "Insufficient resources",
  "53100": "Disk full",
  "53200": "Out of memory",
  "53300": "Too many connections",
  "53400": "Configuration limit exceeded",
  // Class 54 — Program Limit Exceeded
  "54000": "Program limit exceeded",
  "54001": "Statement too complex",
  "54011": "Too many columns",
  "54023": "Too many arguments",
  // Class 55 — Object Not In Prerequisite State
  "55000": "Object not in prerequisite state",
  "55006": "Object in use",
  "55P02": "Cannot change runtime parameter",
  "55P03": "Lock not available",
  "55P04": "Unsafe new enum value usage",
  // Class 57 — Operator Intervention
  "57000": "Operator intervention",
  "57014": "Query canceled",
  "57P01": "Admin shutdown",
  "57P02": "Crash shutdown",
  "57P03": "Cannot connect now",
  "57P04": "Database dropped",
  "57P05": "Idle session timeout",
  // Class 58 — System Error
  "58000": "System error",
  "58030": "I/O error",
  "58P01": "Undefined file",
  "58P02": "Duplicate file",
  // Class F0 — Configuration File Error
  F0000: "Configuration file error",
  F0001: "Lock file exists",
  // Class HV — Foreign Data Wrapper Error
  HV000: "Foreign data wrapper error",
  HV005: "Foreign data wrapper column name not found",
  HV002: "Foreign data wrapper dynamic parameter value needed",
  HV010: "Foreign data wrapper function sequence error",
  HV021: "Foreign data wrapper inconsistent descriptor information",
  HV024: "Foreign data wrapper invalid attribute value",
  HV007: "Foreign data wrapper invalid column name",
  HV008: "Foreign data wrapper invalid column number",
  HV004: "Foreign data wrapper invalid data type",
  HV006: "Foreign data wrapper invalid data type descriptors",
  HV091: "Foreign data wrapper invalid descriptor field identifier",
  HV00B: "Foreign data wrapper invalid handle",
  HV00C: "Foreign data wrapper invalid option index",
  HV00D: "Foreign data wrapper invalid option name",
  HV090: "Foreign data wrapper invalid string length or buffer length",
  HV00A: "Foreign data wrapper invalid string format",
  HV009: "Foreign data wrapper invalid use of null pointer",
  HV014: "Foreign data wrapper too many handles",
  HV001: "Foreign data wrapper out of memory",
  HV00P: "Foreign data wrapper no schemas",
  HV00J: "Foreign data wrapper option name not found",
  HV00K: "Foreign data wrapper reply handle",
  HV00Q: "Foreign data wrapper schema not found",
  HV00R: "Foreign data wrapper table not found",
  HV00L: "Foreign data wrapper unable to create execution",
  HV00M: "Foreign data wrapper unable to create reply",
  HV00N: "Foreign data wrapper unable to establish connection",
  // Class P0 — PL/pgSQL Error
  P0000: "PL/pgSQL error",
  P0001: "Raise exception",
  P0002: "No data found",
  P0003: "Too many rows",
  P0004: "Assert failure",
  // Class XX — Internal Error
  XX000: "Internal error",
  XX001: "Data corrupted",
  XX002: "Index corrupted",
};

export type SupabaseQueryError<T extends string> = {
  message: string;
  code: T;
  postgres: {
    code: PostgreSQLErrorCode;
    message: string;
    hint?: string;
    details?: string;
    cause?: unknown;
    name?: string;
    stack?: string;
  };
};

export type QueryBuilder<R> = (client: SupabaseClient<Database>) => PromiseLike<R>;

// Overload 1: Handles calls WITH a 'caller' argument.
// It uses a template literal type to create the specific error code.
export function handleSupabaseResponse<T, U extends string>(
  response: PostgrestSingleResponse<T>,
  caller: U,
): ResultAsync<T, SupabaseQueryError<`DATABASE_ERROR_${U}`>>;

// Overload 2: Handles calls WITHOUT a 'caller' argument.
// It uses a specific literal type for the error code.
export function handleSupabaseResponse<T>(
  response: PostgrestSingleResponse<T>,
): ResultAsync<T, SupabaseQueryError<"DATABASE_ERROR">>;

// Implementation: This single implementation satisfies both overloads.
// Its signature is general enough to cover both cases.
export function handleSupabaseResponse<T, U extends string>(
  { error, data }: PostgrestSingleResponse<T>,
  caller?: U,
): ResultAsync<T, SupabaseQueryError<U extends string ? `DATABASE_ERROR_${U}` : "DATABASE_ERROR">> {
  if (!error) {
    return okAsync(data as T);
  }

  return errAsync({
    message: `Database query failed${caller ? ` in ${caller}` : ""}`,
    code: (caller ? `DATABASE_ERROR_${caller}` : "DATABASE_ERROR") as U extends string
      ? `DATABASE_ERROR_${U}`
      : "DATABASE_ERROR",
    postgres: {
      code: error.code as PostgreSQLErrorCode,
      message: PostgreSQLErrorMessages[error.code as PostgreSQLErrorCode] || error.message,
      hint: error.hint,
      details: error.details,
      cause: error.cause,
      name: error.name,
      stack: error.stack,
    },
  });
}

// Overloaded supabaseRun function to preserve literal types
export function supabaseRun<T, U extends string>(
  query: PromiseLike<PostgrestSingleResponse<T>>,
  caller: U,
): ResultAsync<T, SupabaseQueryError<`DATABASE_ERROR_${U}`>>;

export function supabaseRun<T>(
  query: PromiseLike<PostgrestSingleResponse<T>>,
): ResultAsync<T, SupabaseQueryError<"DATABASE_ERROR">>;

export function supabaseRun<T>(query: PromiseLike<PostgrestSingleResponse<T>>, caller?: string) {
  return fromSafePromise(query).andThen((response) =>
    caller ? handleSupabaseResponse(response, caller) : handleSupabaseResponse(response),
  );
}

// Overloaded runQuery function to preserve literal types
export function runQuery<T, U extends string>(
  queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>,
  caller: U,
): ResultAsync<T, SupabaseQueryError<`DATABASE_ERROR_${U}`>>;

export function runQuery<T>(
  queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>,
): ResultAsync<T, SupabaseQueryError<"DATABASE_ERROR">>;

export function runQuery<T>(queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>, caller?: string) {
  return createClient().andThen((client) =>
    caller ? supabaseRun(queryBuilder(client), caller) : supabaseRun(queryBuilder(client)),
  );
}

// Overloaded runServiceQuery function to preserve literal types
export function runServiceQuery<T, U extends string>(
  queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>,
  caller: U,
): ResultAsync<T, SupabaseQueryError<`DATABASE_ERROR_${U}`>>;

export function runServiceQuery<T>(
  queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>,
): ResultAsync<T, SupabaseQueryError<"DATABASE_ERROR">>;

export function runServiceQuery<T>(queryBuilder: QueryBuilder<PostgrestSingleResponse<T>>, caller?: string) {
  return createServiceClient().andThen((client) =>
    caller ? supabaseRun(queryBuilder(client), caller) : supabaseRun(queryBuilder(client)),
  );
}
